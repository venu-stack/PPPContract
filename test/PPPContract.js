const chai = require('chai')
const { ethers } = require('hardhat')
const { solidity } = require('ethereum-waffle')

chai.use(solidity)
const { expect } = chai

describe('MultiSigWallet', function () {
  let MultiSigWallet
  let multiSigWallet
  let approvers
  let owner
  let addr1

  beforeEach(async function () {
    MultiSigWallet = await ethers.getContractFactory('MultiSigWallet')
    ;[owner, addr1, ...approvers] = await ethers.getSigners()
    multiSigWallet = await MultiSigWallet.deploy([owner.address, addr1.address])
  })

  it('Should return true for approvers', async function () {
    expect(await multiSigWallet.isApprover(owner.address)).to.equal(true)
    expect(await multiSigWallet.isApprover(addr1.address)).to.equal(true)
  })

  it('Should return false for non-approvers', async function () {
    expect(await multiSigWallet.isApprover(approvers[0].address)).to.equal(
      false
    )
  })
})

describe('PPPContract', function () {
  let PPPContract
  let pppContract
  let MultiSigWallet
  let multiSigWallet
  let government
  let contractor
  let regulator
  let user

  beforeEach(async function () {
    ;[government, contractor, regulator, user, ...addrs] =
      await ethers.getSigners()
    MultiSigWallet = await ethers.getContractFactory('MultiSigWallet')
    multiSigWallet = await MultiSigWallet.deploy([
      government.address,
      contractor.address,
    ])
    PPPContract = await ethers.getContractFactory('PPPContract')
    pppContract = await PPPContract.deploy(multiSigWallet.address, {
      value: 4500000,
    })
  })

  it('Should set the correct contract deployer', async function () {
    expect(await pppContract.government()).to.equal(government.address)
  })

  it('Should allow the government to assign contractor, regulator and users', async function () {
    await pppContract.connect(government).assignContractor(contractor.address)
    await pppContract.connect(government).assignRegulator(regulator.address)
    await pppContract.connect(government).addUser(user.address)

    expect(await pppContract.contractor()).to.equal(contractor.address)
    expect(await pppContract.regulator()).to.equal(regulator.address)
    expect(await pppContract.isUser(user.address)).to.equal(true)
  })

  it('Should allow the government to release initial investment', async function () {
    await pppContract.connect(government).releaseInitialInvestment()
    expect((await pppContract.contractFunds()).toNumber()).to.equal(3000000)
  })

  it('Should allow the contractor to submit work', async function () {
    await pppContract.connect(government).assignContractor(contractor.address)
    await pppContract.connect(contractor).submitWork(10)
    expect((await pppContract.workCompleted()).toNumber()).to.equal(10)
    expect((await pppContract.currentMonth()).toNumber()).to.equal(2)
  })

  it('Should prevent the contractor from submitting more than 25% work in a month', async function () {
    await pppContract.connect(government).assignContractor(contractor.address)
    await expect(
      pppContract.connect(contractor).submitWork(26)
    ).to.be.revertedWith(
      'Invalid work completion. Maximum 25% of work can be completed in one month.'
    )
  })

  it('Should allow users to review and approve work', async function () {
    await pppContract.connect(government).addUser(user.address)
    await pppContract.connect(user).approveWork()
    expect(await pppContract.workApprovals(user.address)).to.equal(true)
  })

  it('Should allow users to rate the quality of the work', async function () {
    await pppContract.connect(government).addUser(user.address)
    await pppContract.connect(user).rateWork(3)
    expect((await pppContract.ratings(user.address)).toNumber()).to.equal(3)
  })

  it('Should prevent users from submitting invalid ratings', async function () {
    await pppContract.connect(government).addUser(user.address)
    await expect(pppContract.connect(user).rateWork(6)).to.be.revertedWith(
      'Invalid rating. Rating should be between 1 and 5.'
    )
  })

  it('Should allow contractor to submit the work and user to approve and rate', async function () {
    await pppContract.connect(government).assignContractor(contractor.address)
    await pppContract.connect(government).addUser(user.address)
    await pppContract.connect(contractor).submitWork(25)
    // await pppContract.connect(user).rateWork(5)
    await pppContract.connect(contractor).submitWork(25)
    // await pppContract.connect(user).rateWork(5)
    await pppContract.connect(contractor).submitWork(25)
    // await pppContract.connect(user).rateWork(5)
    await pppContract.connect(contractor).submitWork(25)
    await pppContract.connect(user).rateWork(5)
    await pppContract.connect(government).assignRegulator(regulator.address)
    await pppContract.connect(regulator).inspectWork()
    expect(await pppContract.regulatorApproval()).to.equal(true)
  })

  it('Should allow contractor to complete contract after work is approved by regulator', async function () {
    await pppContract.connect(government).assignContractor(contractor.address)
    await pppContract.connect(government).addUser(user.address)
    await pppContract.connect(contractor).submitWork(25)
    await pppContract.connect(contractor).submitWork(25)
    await pppContract.connect(contractor).submitWork(25)
    await pppContract.connect(contractor).submitWork(25)
    await pppContract.connect(user).rateWork(5)
    await pppContract.connect(government).assignRegulator(regulator.address)
    await pppContract.connect(regulator).inspectWork()
    await pppContract.connect(government).assignContractor(contractor.address)
    await pppContract.connect(contractor).completeContract()
    expect(await pppContract.fundsReleased()).to.equal(true)
  })
})

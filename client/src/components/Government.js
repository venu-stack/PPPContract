import React, { useState } from 'react'
import './Government.css'

function Government({ state }) {
  const [username, setUsername] = useState('')
  const [contractor, setContractor] = useState('')
  const [regulator, setRegulator] = useState('')
  const { contract } = state
  const handleAddUser = async () => {
    try {
      let tx = await contract.addUser(username)
      await tx.wait()
      alert('User added successfully')
    } catch (err) {
      console.error(err)
      alert('Error adding user')
    }
  }

  const handleAssignContractor = async () => {
    try {
      let tx = await contract.assignContractor(contractor)
      await tx.wait()
      alert('Contractor assigned successfully')
    } catch (err) {
      console.error(err)
      alert('Error assigning contractor')
    }
  }

  const handleAssignRegulator = async () => {
    try {
      let tx = await contract.assignRegulator(regulator)
      await tx.wait()
      alert('Regulator assigned successfully')
    } catch (err) {
      console.error(err)
      alert('Error assigning regulator')
    }
  }

  const handleReleaseInitialInvestment = async () => {
    try {
      let tx = await contract.releaseInitialInvestment()
      await tx.wait()
      alert('Initial investment released successfully')
    } catch (err) {
      console.error(err)
      alert('Error releasing initial investment')
    }
  }

  return (
    <div className='government'>
      <h1>Government</h1>
      <input
        className='input-field'
        type='text'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder='Add User'
      />
      <button className='btn' onClick={handleAddUser}>
        Add User
      </button>

      <input
        className='input-field'
        type='text'
        value={contractor}
        onChange={(e) => setContractor(e.target.value)}
        placeholder='Assign Contractor'
      />
      <button className='btn' onClick={handleAssignContractor}>
        Assign Contractor
      </button>

      <input
        className='input-field'
        type='text'
        value={regulator}
        onChange={(e) => setRegulator(e.target.value)}
        placeholder='Assign Regulator'
      />
      <button className='btn' onClick={handleAssignRegulator}>
        Assign Regulator
      </button>

      <button className='btn' onClick={handleReleaseInitialInvestment}>
        Release Initial Investment
      </button>
    </div>
  )
}

export default Government

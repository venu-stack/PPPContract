import React, { useState } from 'react'

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
    <div>
      <h1>Government</h1>
      <input
        type='text'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder='Add User'
      />
      <button onClick={handleAddUser}>Add User</button>

      <input
        type='text'
        value={contractor}
        onChange={(e) => setContractor(e.target.value)}
        placeholder='Assign Contractor'
      />
      <button onClick={handleAssignContractor}>Assign Contractor</button>

      <input
        type='text'
        value={regulator}
        onChange={(e) => setRegulator(e.target.value)}
        placeholder='Assign Regulator'
      />
      <button onClick={handleAssignRegulator}>Assign Regulator</button>

      <button onClick={handleReleaseInitialInvestment}>
        Release Initial Investment
      </button>
    </div>
  )
}

export default Government

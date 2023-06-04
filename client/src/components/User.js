import React, { useState } from 'react'
import './User.css'

function User({ state }) {
  const [rating, setRating] = useState(1)

  const { contract } = state

  const handleRateWork = async () => {
    try {
      let tx = await contract.rateWork(rating)
      await tx.wait()
      alert('Rating submitted successfully')
    } catch (err) {
      console.error(err)
      alert('Error rating work')
    }
  }

  const handleApproveWork = async () => {
    try {
      let tx = await contract.approveWork()
      await tx.wait()
      alert('Work approved successfully')
    } catch (err) {
      console.error(err)
      alert('Error approving work')
    }
  }

  return (
    <div className='container'>
      <h1>User</h1>

      <input
        type='number'
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        min='1'
        max='5'
      />
      <button onClick={handleRateWork}>Rate Work</button>
      <button onClick={handleApproveWork}>Approve Work</button>
    </div>
  )
}

export default User

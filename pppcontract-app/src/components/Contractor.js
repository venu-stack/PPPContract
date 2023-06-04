import React, { useState } from 'react'

function Contractor({ state }) {
  const [workCompleted, setWorkCompleted] = useState(0)
  const { contract } = state
  const handleSubmitWork = async () => {
    try {
      let tx = await contract.submitWork(workCompleted)
      await tx.wait()
      alert('Work submitted successfully')
    } catch (err) {
      console.error(err)
      alert('Error submitting work')
    }
  }

  const handleCompleteContract = async () => {
    try {
      let tx = await contract.completeContract()
      await tx.wait()
      alert('Contract completed successfully')
    } catch (err) {
      console.error(err)
      alert('Error completing contract')
    }
  }

  return (
    <div>
      <h1>Contractor</h1>
      <input
        type='number'
        value={workCompleted}
        onChange={(e) => setWorkCompleted(e.target.value)}
      />
      <button onClick={handleSubmitWork}>Submit Work</button>
      <button onClick={handleCompleteContract}>Complete Contract</button>
    </div>
  )
}

export default Contractor

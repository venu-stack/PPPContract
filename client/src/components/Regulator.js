import React from 'react'
import './Regulator.css'

function Regulator({ state }) {
  const { contract } = state
  const handleInspectWork = async () => {
    try {
      let tx = await contract.inspectWork()
      await tx.wait()
      alert('Work inspected successfully')
    } catch (err) {
      console.error(err)
      alert('Error inspecting work')
    }
  }

  return (
    <div className='regulator-container'>
      <h1 className='regulator-header'>Regulator</h1>
      <button className='regulator-button' onClick={handleInspectWork}>
        Inspect Work
      </button>
    </div>
  )
}

export default Regulator

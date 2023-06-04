import React from 'react'

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
    <div>
      <h1>Regulator</h1>
      <button onClick={handleInspectWork}>Inspect Work</button>
    </div>
  )
}

export default Regulator

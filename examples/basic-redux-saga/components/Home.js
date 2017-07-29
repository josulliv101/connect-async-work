import React from 'react'

function Home() {
  console.log('Home / render')
  return (
    <div>
      <h3>Home</h3>
      <div>
        <em>All routes except 'Home' have async work.</em>
      </div>
    </div>
  )
}

export default Home

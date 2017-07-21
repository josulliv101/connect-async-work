import React from 'react'
import { connect } from 'react-redux'
import { increase, decrease } from '../actions/count'
import style from '../style'

function Home({ number, increase, decrease }) {
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

export default connect(
  state => ({ number: state.count.number }),
  { increase, decrease }
)(Home)

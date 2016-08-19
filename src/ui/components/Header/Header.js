import React from 'react'
import { IndexLink, Link } from 'react-router'
import classes from './Header.scss'

export const Header = () => (
  <div className='row'>
    <IndexLink to='/' activeClassName={classes.activeRoute} />
    {' · '}
    <Link to='/bubbles' activeClassName={classes.activeRoute}>
      Counter
    </Link>
  </div>
)

export default Header

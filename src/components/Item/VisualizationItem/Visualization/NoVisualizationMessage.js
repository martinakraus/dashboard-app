import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/NoVisualizationMessage.module.css'

const NoVisualizationMessage = ({ message }) => {
    return <div className={classes.message}>{message}</div>
}

NoVisualizationMessage.propTypes = {
    message: PropTypes.string,
}

export default NoVisualizationMessage

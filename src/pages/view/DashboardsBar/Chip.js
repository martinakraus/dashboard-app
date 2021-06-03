import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import cx from 'classnames'
import {
    Chip as UiChip,
    colors,
    IconStarFilled24,
    CircularLoader,
} from '@dhis2/ui'
import { Link } from 'react-router-dom'
import debounce from 'lodash/debounce'
import { OfflineSaved } from './assets/icons'
import { useCacheableSectionStatus } from '../../../modules/useCacheableSectionStatus'
import { sGetCacheVersion } from '../../../reducers/cacheVersion'

import { apiPostDataStatistics } from '../../../api/dataStatistics'

import classes from './styles/Chip.module.css'

const Chip = ({
    starred,
    selected,
    label,
    dashboardId,
    onClick,
    cacheVersion,
}) => {
    const { lastUpdated, recording } = useCacheableSectionStatus(dashboardId)
    const chipProps = {
        selected,
    }

    const i = 0
    if (i > 0) {
        console.log('cacheVersion', cacheVersion)
    }

    if (starred) {
        chipProps.icon = (
            <IconStarFilled24
                color={selected ? colors.white : colors.grey600}
            />
        )
    }
    const debouncedPostStatistics = debounce(
        () => apiPostDataStatistics('DASHBOARD_VIEW', dashboardId),
        500
    )

    const handleClick = () => {
        debouncedPostStatistics()
        onClick()
    }

    const getAdornment = () => {
        if (recording) {
            return (
                <CircularLoader
                    className={cx(
                        classes.progressIndicator,
                        selected && classes.selected
                    )}
                    small
                />
            )
        } else if (lastUpdated) {
            return (
                <OfflineSaved
                    className={cx(
                        classes.adornment,
                        selected && classes.selected
                    )}
                />
            )
        }
        return null
    }

    return (
        <Link
            className={classes.link}
            to={`/${dashboardId}`}
            onClick={handleClick}
            data-test="dashboard-chip"
        >
            <UiChip {...chipProps}>
                <span
                    className={
                        lastUpdated || recording
                            ? classes.labelWithAdornment
                            : undefined
                    }
                >
                    {label}
                </span>
                {getAdornment()}
            </UiChip>
        </Link>
    )
}

Chip.propTypes = {
    dashboardId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    starred: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    cacheVersion: PropTypes.number,
}

const mapStateToProps = state => ({
    cacheVersion: sGetCacheVersion(state),
})

export default connect(mapStateToProps, null)(Chip)

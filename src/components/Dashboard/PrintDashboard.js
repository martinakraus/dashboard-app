import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'

import PrintInfo from './PrintInfo'
import PrintActionsBar from './PrintActionsBar'
import PrintItemGrid from '../ItemGrid/PrintItemGrid'
import { PRINT_TITLE_PAGE, PAGEBREAK } from '../../modules/itemTypes'

import {
    a4LandscapeWidthPx,
    sortItemsByYPosition,
} from '../../modules/printUtils'

import {
    acSetEditDashboard,
    acAddDashboardItem,
} from '../../actions/editDashboard'
import { sGetSelectedId } from '../../reducers/selected'
import {
    sGetDashboardById,
    sGetDashboardItems,
} from '../../reducers/dashboards'

import classes from './PrintDashboard.module.css'

export class PrintDashboard extends Component {
    state = {
        initialized: false,
    }

    initPrintDashboard = () => {
        if (this.props.dashboard) {
            this.setState({ initialized: true })
            this.props.setEditDashboard(this.props.dashboard, this.props.items)

            //sorting the items is so that the print, with one item per page
            //prints in the order of top to bottom of the dashboard
            sortItemsByYPosition(this.props.items)

            for (let i = 0; i < this.props.items.length * 2; i += 2) {
                this.props.addDashboardItem({ type: PAGEBREAK, position: i })
            }

            this.props.addDashboardItem({ type: PRINT_TITLE_PAGE })
        }
    }

    componentDidMount() {
        this.initPrintDashboard()
    }

    componentDidUpdate() {
        if (!this.state.initialized) {
            this.initPrintDashboard()
        }
    }

    render() {
        return (
            <>
                <PrintActionsBar id={this.props.dashboard.id} />
                <div className={classes.wrapper}>
                    <PrintInfo type={i18n.t('one item per page')} />
                    <div
                        className={classes.pageOuter}
                        style={{ width: a4LandscapeWidthPx }}
                    >
                        <PrintItemGrid />
                    </div>
                </div>
            </>
        )
    }
}

PrintDashboard.propTypes = {
    addDashboardItem: PropTypes.func,
    dashboard: PropTypes.object,
    items: PropTypes.array,
    setEditDashboard: PropTypes.func,
}

const mapStateToProps = state => {
    const id = sGetSelectedId(state)
    const dashboard = id ? sGetDashboardById(state, id) : null

    return {
        dashboard,
        id,
        items: sGetDashboardItems(state),
    }
}

export default connect(mapStateToProps, {
    setEditDashboard: acSetEditDashboard,
    addDashboardItem: acAddDashboardItem,
})(PrintDashboard)

import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { acSetEditNewDashboard } from '../../actions/editDashboard.js'
import DashboardContainer from '../../components/DashboardContainer.js'
import Notice from '../../components/Notice.js'
import { useWindowDimensions } from '../../components/WindowDimensionsProvider.js'
import { setHeaderbarVisible } from '../../modules/setHeaderbarVisible.js'
import { isSmallScreen } from '../../modules/smallScreen.js'
import { sGetIsPrintPreviewView } from '../../reducers/editDashboard.js'
import LayoutPrintPreview from '../print/PrintLayoutDashboard.js'
import ActionsBar from './ActionsBar.js'
import ItemGrid from './ItemGrid.js'
import classes from './styles/NewDashboard.module.css'
import TitleBar from './TitleBar.js'

const NewDashboard = (props) => {
    const { width } = useWindowDimensions()
    const [redirectUrl, setRedirectUrl] = useState(null)

    useEffect(() => {
        if (isSmallScreen(width)) {
            setRedirectUrl('/')
            return
        }
        setHeaderbarVisible(true)
        props.setNewDashboard()
    }, [])

    if (redirectUrl) {
        return <Redirect to={redirectUrl} />
    }

    return (
        <>
            <div
                className={cx(classes.container, 'dashboard-scroll-container')}
            >
                <ActionsBar />
                {props.isPrintPreviewView ? (
                    <LayoutPrintPreview fromEdit={true} />
                ) : (
                    <DashboardContainer>
                        <TitleBar />
                        <ItemGrid />
                    </DashboardContainer>
                )}
            </div>
            <div className={classes.notice}>
                <Notice
                    title={i18n.t('Not supported')}
                    message={i18n.t(
                        'Editing dashboards on small screens is not supported. Resize your screen to return to edit mode.'
                    )}
                />
            </div>
        </>
    )
}

NewDashboard.propTypes = {
    isPrintPreviewView: PropTypes.bool,
    setNewDashboard: PropTypes.func,
}

const mapStateToProps = (state) => ({
    isPrintPreviewView: sGetIsPrintPreviewView(state),
})

export default connect(mapStateToProps, {
    setNewDashboard: acSetEditNewDashboard,
})(NewDashboard)

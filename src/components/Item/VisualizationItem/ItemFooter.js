import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { useOnlineStatus } from '@dhis2/app-service-offline'
import i18n from '@dhis2/d2-i18n'
import InterpretationsComponent from '@dhis2/d2-ui-interpretations'
import PropTypes from 'prop-types'
import React from 'react'
import { getVisualizationId } from '../../../modules/item'
import FatalErrorBoundary from './FatalErrorBoundary'
import classes from './styles/ItemFooter.module.css'

const ItemFooter = props => {
    const { d2 } = useD2()
    const { online } = useOnlineStatus()

    return (
        <div data-test="dashboarditem-footer" style={{ position: 'relative' }}>
            <hr className={classes.line} />
            <div className={classes.scrollContainer}>
                <FatalErrorBoundary
                    message={i18n.t(
                        'There was a problem loading interpretations for this item'
                    )}
                >
                    <InterpretationsComponent
                        d2={d2}
                        item={props.item}
                        type={props.item.type.toLowerCase()}
                        id={getVisualizationId(props.item)}
                        appName="dashboard"
                        isOffline={!online}
                    />
                </FatalErrorBoundary>
            </div>
        </div>
    )
}

ItemFooter.propTypes = {
    item: PropTypes.object.isRequired,
}

export default ItemFooter

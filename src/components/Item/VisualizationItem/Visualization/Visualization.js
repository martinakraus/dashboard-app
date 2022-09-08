import i18n from '@dhis2/d2-i18n'
import uniqueId from 'lodash/uniqueId.js'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { isEditMode } from '../../../../modules/dashboardModes.js'
import { getVisualizationId } from '../../../../modules/item.js'
import {
    VISUALIZATION,
    MAP,
    CHART,
    REPORT_TABLE,
    getItemTypeForVis,
} from '../../../../modules/itemTypes.js'
import {
    sGetItemFiltersRoot,
    DEFAULT_STATE_ITEM_FILTERS,
} from '../../../../reducers/itemFilters.js'
import { sGetVisualization } from '../../../../reducers/visualizations.js'
import memoizeOne from '../memoizeOne.js'
import DataVisualizerPlugin from './DataVisualizerPlugin.js'
import getFilteredVisualization from './getFilteredVisualization.js'
import getVisualizationConfig from './getVisualizationConfig.js'
import LegacyPlugin from './LegacyPlugin.js'
import MapPlugin from './MapPlugin.js'
import NoVisualizationMessage from './NoVisualizationMessage.js'
import { pluginIsAvailable } from './plugin.js'

const Visualization = ({
    visualization,
    activeType,
    item,
    itemFilters,
    availableHeight,
    availableWidth,
    dashboardMode,
    ...rest
}) => {
    const memoizedGetFilteredVisualization = memoizeOne(
        getFilteredVisualization
    )
    const memoizedGetVisualizationConfig = memoizeOne(getVisualizationConfig)

    const getFilterVersion = memoizeOne(() => uniqueId())

    if (!visualization) {
        return <NoVisualizationMessage message={i18n.t('No data to display')} />
    }

    const style = { height: availableHeight }
    if (availableWidth) {
        style.width = availableWidth
    }

    const visualizationConfig = memoizedGetVisualizationConfig(
        visualization,
        getItemTypeForVis(item),
        activeType
    )

    const filterVersion = getFilterVersion(itemFilters)

    switch (activeType) {
        case VISUALIZATION:
        case CHART:
        case REPORT_TABLE: {
            return (
                <DataVisualizerPlugin
                    visualization={memoizedGetFilteredVisualization(
                        visualizationConfig,
                        itemFilters
                    )}
                    style={style}
                    filterVersion={filterVersion}
                    item={item}
                    dashboardMode={dashboardMode}
                />
            )
        }

        const style = { height: this.props.availableHeight }
        if (this.props.availableWidth) {
            style.width = this.props.availableWidth
        }
        case MAP: {
            return (
                <MapPlugin
                    item={item}
                    activeType={activeType}
                    visualization={visualizationConfig}
                    itemFilters={itemFilters}
                    applyFilters={memoizedGetFilteredVisualization}
                    filterVersion={filterVersion}
                    style={style}
                    {...rest}
                />
            )
        }
        default: {
            return pluginIsAvailable(activeType || item.type) ? (
                <LegacyPlugin
                    item={item}
                    activeType={activeType}
                    visualization={memoizedGetFilteredVisualization(
                        visualizationConfig,
                        itemFilters
                    )}
                    filterVersion={filterVersion}
                    style={style}
                    {...rest}
                />
            ) : (
                <NoVisualizationMessage
                    message={i18n.t('Unable to load the plugin for this item')}
                />
            )
        }
    }
}

Visualization.propTypes = {
    activeType: PropTypes.string,
    availableHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    availableWidth: PropTypes.number,
    dashboardMode: PropTypes.string,
    item: PropTypes.object,
    itemFilters: PropTypes.object,
    visualization: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => {
    const itemFilters = !isEditMode(ownProps.dashboardMode)
        ? sGetItemFiltersRoot(state)
        : DEFAULT_STATE_ITEM_FILTERS

    return {
        itemFilters,
        visualization: sGetVisualization(
            state,
            getVisualizationId(ownProps.item)
        ),
    }
}

export default connect(mapStateToProps)(Visualization)

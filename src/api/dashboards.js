import arrayClean from 'd2-utilizr/lib/arrayClean'
import { onError, getDashboardFields } from './index'

export const dashboardsQuery = {
    resource: 'dashboards',
    params: {
        fields: [getDashboardFields(), 'dashboardItems[id]'].join(','),
        paging: false,
    },
}

export const dashboardQuery = {
    resource: 'dashboards',
    id: ({ id }) => id,
    params: {
        fields: arrayClean(
            getDashboardFields({
                withItems: true,
                withFavorite: { withDimensions: false },
            })
        ).join(','),
    },
}

export const deleteDashboardMutation = {
    type: 'delete',
    resource: 'dashboards',
    id: ({ id }) => id,
}

// Get "all" dashboards on startup
export const apiFetchDashboards = async dataEngine => {
    try {
        const dashboardsData = await dataEngine.query({
            dashboards: dashboardsQuery,
        })

        return dashboardsData.dashboards.dashboards
    } catch (error) {
        onError(error)
    }
}

// Get more info about selected dashboard
export const apiFetchDashboard = async (dataEngine, id) => {
    try {
        const dashboardData = await dataEngine.query(
            { dashboard: dashboardQuery },
            {
                variables: {
                    id,
                },
            }
        )

        return dashboardData.dashboard
    } catch (error) {
        onError(error)
    }
}

export const apiDeleteDashboard = async (dataEngine, id) => {
    try {
        await dataEngine.mutate(deleteDashboardMutation, { variables: { id } })
    } catch (error) {
        onError(error)
    }
}

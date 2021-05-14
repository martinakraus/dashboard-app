import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { Button, Tooltip } from '@dhis2/ui'
import { useOnlineStatus } from '../modules/useOnlineStatus'

const ButtonWithTooltip = ({ disabledWhenOffline, children, ...rest }) => {
    const { isOnline } = useOnlineStatus()

    const notAllowed = disabledWhenOffline && !isOnline

    return (
        <Tooltip
            content={notAllowed ? i18n.t('Not available offline') : ''}
            openDelay={200}
            closeDelay={100}
        >
            {({ onMouseOver, onMouseOut, ref }) => (
                <span
                    onMouseOver={() => notAllowed && onMouseOver()}
                    onMouseOut={() => notAllowed && onMouseOut()}
                    ref={ref}
                >
                    <Button disabled={notAllowed} {...rest}>
                        {children}
                    </Button>
                    <style jsx>{`
                        span {
                            display: inline-flex;
                            pointer-events: all;
                            cursor: ${notAllowed ? 'not-allowed' : 'block'};
                        }
                        span > :global(button:disabled) {
                            pointer-events: none;
                        }
                    `}</style>
                </span>
            )}
        </Tooltip>
    )
}

ButtonWithTooltip.propTypes = {
    children: PropTypes.node,
    disabledWhenOffline: PropTypes.bool,
}

ButtonWithTooltip.defaultProps = {
    disabledWhenOffline: true,
}

export default ButtonWithTooltip
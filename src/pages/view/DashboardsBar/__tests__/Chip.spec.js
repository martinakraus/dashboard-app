import React from 'react'
import { shallow } from 'enzyme'
import { Chip as UiChip, colors } from '@dhis2/ui'
import { Chip } from '../Chip'

describe('Chip', () => {
    const defaultProps = {
        starred: false,
        selected: false,
        onClick: jest.fn(),
        label: 'Hello Rainbow Dash',
        dashboardId: 'myLittlePony',
        classes: {
            icon: 'iconClass',
            selected: 'selectedClass',
            unselected: 'unselectedClass',
        },
    }

    const wrapper = props => shallow(<Chip {...props} />)

    it('renders a Link', () => {
        const chipWrapper = wrapper(defaultProps)

        const div = chipWrapper.find('Link')
        expect(div).toHaveLength(1)
    })

    it('renders a Link containing everything else', () => {
        const chipWrapper = wrapper(defaultProps)
        const wrappingDiv = chipWrapper.find('Link').first()

        expect(wrappingDiv.children()).toEqual(chipWrapper.children())
    })

    it('renders a Chip inside the Link', () => {
        const chipWrapper = wrapper(defaultProps)

        expect(chipWrapper.find(UiChip).length).toBe(1)
    })

    it('does not pass an icon to Chip when not starred', () => {
        const chip = wrapper(defaultProps).find(UiChip)

        expect(chip.prop('icon')).toBeFalsy()
    })

    it('passes an icon to Chip when starred', () => {
        const props = Object.assign({}, defaultProps, { starred: true })

        const iconColorProp = wrapper(props).find(UiChip).prop('icon').props
            .color

        expect(iconColorProp).toEqual(colors.grey600)
    })

    it('sets the white color on icon when chip is selected', () => {
        const props = Object.assign({}, defaultProps, {
            starred: true,
            selected: true,
        })
        const iconColorProp = wrapper(props).find(UiChip).prop('icon').props
            .color

        expect(iconColorProp).toEqual(colors.white)
    })

    it('passes "label" property to Chip as children', () => {
        const chip = wrapper(defaultProps).find(UiChip)

        expect(chip.childAt(0).text()).toBe(defaultProps.label)
    })
})

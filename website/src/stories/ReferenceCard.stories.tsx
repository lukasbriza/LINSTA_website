import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ReferenceCard } from '../components'
import img from '../assets/referencePicturetest.jpg'


export default {
    title: 'Components/ReferenceCard',
    component: ReferenceCard,
} as ComponentMeta<typeof ReferenceCard>;

const Template: ComponentStory<typeof ReferenceCard> = (args) => (<ReferenceCard {...args} />);

export const Default = Template.bind({})
Default.args = {
    src: img,
    header: "Název stavby",
    place: "Nová Ves",
    realization: "2022"
}
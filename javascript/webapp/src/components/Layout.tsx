/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { type ResourceTreeData, DataShaperApp } from '@datashaper/app-framework'
import { lazy, memo, useState, useCallback, Suspense } from 'react'

import { useExampleProjects } from '../hooks/examples.js'
import { pages } from '../pages.js'
import { Header } from './Header.js'
import { Container, Content, Main } from './Layout.styles.js'
import type { LayoutProps } from './Layout.types.js'
import { DiscoveryPersistenceProvider } from '@showwhy/discover-app'
import { EventsPersistenceProvider } from '@showwhy/event-analysis-app'
import { ModelExposurePersistenceProvider } from '@showwhy/model-exposure-app'
import { Spinner } from '@fluentui/react'

const ExposureApp = lazy(
	() =>
		import(
			/* webpackChunkName: "ModelExposure" */
			'@showwhy/model-exposure-app'
		),
)

const DiscoverApp = lazy(
	() =>
		import(
			/* webpackChunkName: "Explore" */
			'@showwhy/discover-app'
		),
)
const EventsApp = lazy(
	() =>
		import(
			/* webpackChunkName: "EventAnalysis" */
			'@showwhy/event-analysis-app'
		),
)

const HomePage = lazy(() => import('../pages/HomePage.js'))

const HANDLERS = {
	discover: DiscoverApp,
	exposure: ExposureApp,
	events: EventsApp,
}

export const Layout: React.FC<LayoutProps> = memo(function Layout({}) {
	const examples = useExampleProjects()
	const [selectedKey, setSelectedKey] = useState<string | undefined>()
	const onSelectItem = useCallback(
		(v: ResourceTreeData) => {
			setSelectedKey(v.key)
		},
		[setSelectedKey],
	)

	return (
		<Container id="layout">
			<style>
				{`* {
					box-sizing: border-box;
				}`}
			</style>
			<Header />
			<Main>
				<Content>
					<>
						{/* Application Persistence Utilities */}
						<ModelExposurePersistenceProvider />
						<DiscoveryPersistenceProvider />
						<EventsPersistenceProvider />
					</>
					<Suspense fallback={<Spinner />}>
						<DataShaperApp
							handlers={HANDLERS}
							examples={examples}
							appResources={appResources}
							selectedKey={selectedKey}
							frontPage={() => <HomePage onClickCard={setSelectedKey} />}
							onSelect={onSelectItem}
						/>
					</Suspense>
				</Content>
			</Main>
		</Container>
	)
})

const appResources: ResourceTreeData[] = [
	{
		title: 'Causal Discovery',
		icon: pages.discover.icon,
		key: `${pages.discover.route}`,
	},
	{
		title: 'Exposure Analysis',
		icon: pages.exposure.icon,
		key: `${pages.exposure.route}`,
	},
	{
		title: 'Event Analysis',
		icon: pages.events.icon,
		key: `${pages.events.route}`,
	},
]

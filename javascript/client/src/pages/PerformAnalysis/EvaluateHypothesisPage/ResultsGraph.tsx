/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Dimensions } from '@essex/hooks'
import type { Experiment, Maybe } from '@showwhy/types';
import { DefinitionType , RefutationType } from '@showwhy/types'
import { memo } from 'react'

import { Bold, Container, Paragraph, Text, Value } from '~styles'
import type {
	DecisionFeature,
	Specification,
	SpecificationCurveConfig,
} from '~types'
import { getDefinitionsByType, median as calcMedian } from '~utils'

import { OutcomeEffectScatterplot } from '../ExploreSpecificationCurvePage/vega'

export const ResultsGraph: React.FC<{
	specificationData: Specification[]
	activeValues: number[]
	defineQuestion: Experiment
	specificationCurveConfig: SpecificationCurveConfig
	vegaWindowDimensions: Dimensions
	onMouseOver: (item: Maybe<Specification | DecisionFeature>) => void
	hovered: Maybe<number>
	failedRefutationIds: number[]
	refutationType: RefutationType
}> = memo(function ResultsGraph({
	specificationData,
	activeValues,
	defineQuestion,
	specificationCurveConfig,
	vegaWindowDimensions,
	onMouseOver,
	hovered,
	failedRefutationIds,
	refutationType,
}) {
	const median = parseFloat(calcMedian(activeValues).toFixed(3))
	const exposure = defineQuestion?.exposure?.label || '<exposure>'
	const outcome = defineQuestion?.outcome?.label || '<outcome>'
	const hypothesis = defineQuestion?.hypothesis || '<hypothesis>'

	return (
		<Container>
			<Paragraph>
				<Value>{activeValues.length}</Value>
				of {specificationData.length} specifications were included in the final
				curve. The median effect estimated from these specifications is{' '}
				<Value>{median}.</Value> This means that the exposure to {exposure}{' '}
				causes the {outcome} to {hypothesis} by
				<Value>{median}.</Value>
				This was calculated using
				<Value>{getDefinitionsByType(DefinitionType.Population, defineQuestion?.definitions).length}</Value>
				population and
				<Value>{getDefinitionsByType(DefinitionType.Exposure, defineQuestion?.definitions).length}</Value>
				exposure definitions.
				{refutationType === RefutationType.QuickRefutation && (
					<Text>
						{' '}
						Consider running the analysis with the
						<Bold> Full Refutation</Bold> mode before proceeding to the
						significance test.
					</Text>
				)}
			</Paragraph>
			<OutcomeEffectScatterplot
				data={specificationData}
				config={specificationCurveConfig}
				width={vegaWindowDimensions.width}
				height={vegaWindowDimensions.height * 0.25}
				onMouseOver={onMouseOver}
				hovered={hovered}
				title="Specification"
				failedRefutationIds={failedRefutationIds}
			/>
		</Container>
	)
})

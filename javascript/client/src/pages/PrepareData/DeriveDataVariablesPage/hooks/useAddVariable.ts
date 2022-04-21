/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useBoolean } from '@fluentui/react-hooks'
import type {
	BeliefDegree,
	CausalFactor,
	DefinitionType,
	ElementDefinition,
	Handler,
	Handler1,
} from '@showwhy/types'
import { CausalFactorType, CausalityLevel } from '@showwhy/types'
import { useCallback, useState } from 'react'
import { v4 as uuiv4 } from 'uuid'

import { useAddOrEditFactorTestable, useSaveDefinition } from '~hooks'
import {
	useCausalFactors,
	useExperiment,
	useSetCausalFactors,
	useSetExperiment,
	useSetSubjectIdentifier,
	useSubjectIdentifier,
} from '~state'
import { isCausalFactorType } from '~utils'

export function useAddVariable(): {
	showCallout: boolean
	toggleShowCallout: Handler
	selectedColumn: string
	setSelectedColumn: Handler1<string>
	onAdd: (
		variable: string,
		type: DefinitionType | CausalFactorType,
		degree?: BeliefDegree,
	) => void
} {
	const [showCallout, { toggle: toggleShowCallout }] = useBoolean(false)
	const [selectedColumn, setSelectedColumn] = useState('')

	const defineQuestion = useExperiment()
	const setDefineQuestion = useSetExperiment()
	const subjectIdentifier = useSubjectIdentifier()
	const setSubjectIdentifier = useSetSubjectIdentifier()
	const saveDefinition = useSaveDefinition(defineQuestion, setDefineQuestion)
	const causalFactors = useCausalFactors()
	const setCausalFactors = useSetCausalFactors()
	const addFactor = useAddOrEditFactorTestable(causalFactors, setCausalFactors)

	const onAdd = useCallback(
		(
			variable: string,
			type: DefinitionType | CausalFactorType,
			degree?: BeliefDegree,
		) => {
			if (subjectIdentifier === selectedColumn) setSubjectIdentifier(undefined)
			if (
				variable &&
				isCausalFactorType(type as CausalFactorType) &&
				degree !== undefined
			) {
				const object = {
					id: uuiv4(),
					description: '',
					variable,
					column: selectedColumn,
					causes: buildCauses(degree, type as CausalFactorType),
				} as CausalFactor
				addFactor(object)
			} else if (variable) {
				const newElement: ElementDefinition = {
					variable,
					description: '',
					level: (defineQuestion as any)?.definitions.some(
						(d: ElementDefinition) => d.type === type,
					)
						? CausalityLevel.Secondary
						: CausalityLevel.Primary,
					id: uuiv4(),
					column: selectedColumn,
					type: type as DefinitionType,
				}
				saveDefinition(newElement)
			}
			toggleShowCallout()
		},
		[
			selectedColumn,
			saveDefinition,
			toggleShowCallout,
			addFactor,
			defineQuestion,
			subjectIdentifier,
			setSubjectIdentifier,
		],
	)
	return {
		showCallout,
		toggleShowCallout,
		selectedColumn,
		setSelectedColumn,
		onAdd,
	}
}

function buildCauses(degree: BeliefDegree, type: CausalFactorType) {
	const causes = {
		reasoning: '',
	}
	switch (type) {
		case CausalFactorType.Confounders:
			return {
				...causes,
				[CausalFactorType.CauseExposure]: degree,
				[CausalFactorType.CauseOutcome]: degree,
			}
		case CausalFactorType.CauseExposure:
			return {
				...causes,
				[CausalFactorType.CauseExposure]: degree,
			}
		case CausalFactorType.CauseOutcome:
			return {
				...causes,
				[CausalFactorType.CauseOutcome]: degree,
			}
	}
}

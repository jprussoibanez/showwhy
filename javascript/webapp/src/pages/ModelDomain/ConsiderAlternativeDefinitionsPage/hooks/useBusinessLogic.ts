/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Definition, Maybe, Question, Setter } from '@showwhy/types'
import { DefinitionType } from '@showwhy/types'
import { useEffect, useMemo, useState } from 'react'

import { useHandleOnLinkClick } from '~hooks'
import {
	useDefinitions,
	useDefinitionType,
	useQuestion,
	useSetDefinitionType,
} from '~state'
import { getDefinitionsByType } from '~utils'

import {
	useAddDefinition,
	useEditDefinition,
	useRemoveDefinition,
	useSetPageDone,
} from '../ConsiderAlternativeDefinitionsPage.hooks'

interface PivotData {
	key: string
	title: string
	label: string
	description: string
	items: Record<string, any>[]
}

export function useBusinessLogic(): {
	definitionToEdit: Maybe<Definition>
	question: Question
	pivotData: PivotData[]
	addDefinition: (def: Definition) => void
	removeDefinition: (def: Definition) => void
	editDefinition: (def: Definition) => void
	setDefinitionToEdit: Setter<Maybe<Definition>>
	definitionType: DefinitionType
	handleOnLinkClick: (item: any) => void
	shouldHavePrimary: boolean
	definitions: Definition[]
} {
	const definitions = useDefinitions()
	const question = useQuestion()
	const definitionType = useDefinitionType()
	const [definitionToEdit, setDefinitionToEdit] = useState<Definition>()
	const shouldHavePrimary = !getDefinitionsByType(definitionType, definitions)
		.length

	const pivotData: PivotData[] = usePivotData(question, definitions)

	const addDefinition = useAddDefinition(definitions)

	const removeDefinition = useRemoveDefinition(definitions)

	const editDefinition = useEditDefinition(definitions)

	const handleOnLinkClick = useHandleOnLinkClick()

	const setDefinitionType = useSetDefinitionType()

	useEffect(() => {
		setDefinitionType(DefinitionType.Population)
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [])

	useEffect(() => {
		setDefinitionToEdit(undefined)
	}, [definitions, setDefinitionToEdit])
	useSetPageDone()

	return {
		definitionToEdit,
		question,
		pivotData,
		definitionType,
		addDefinition,
		removeDefinition,
		editDefinition,
		setDefinitionToEdit,
		handleOnLinkClick,
		shouldHavePrimary,
		definitions,
	}
}

function useItemList(definitions: Definition[] = []): Record<string, any>[] {
	return useMemo(() => {
		return definitions?.map(x => {
			const newObj = { ...x, dataPw: 'definition-element' }
			delete newObj.column
			return newObj
		})
	}, [definitions])
}

function usePivotData(
	question: Question,
	definitions: Definition[],
): PivotData[] {
	const itemList = useItemList(definitions)
	return useMemo(() => {
		const types = Object.keys(DefinitionType)
		const pivotData = types.reduce((acc: PivotData[], curr: string) => {
			const type = curr.toLowerCase()
			const { label = '', description = '' } = (question as any)[type] || {}
			acc = [
				...acc,
				{
					title: curr,
					label,
					description,
					key: type,
					items: itemList.filter(i => i['type'] === type),
				},
			]
			return acc
		}, [])
		return pivotData
	}, [question, itemList])
}

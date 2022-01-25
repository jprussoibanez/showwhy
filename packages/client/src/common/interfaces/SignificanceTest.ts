/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { TestResults } from './TestResults'
import { NodeResponse, NodeResponseStatus } from '~interfaces'

export interface SignificanceTest {
	runId: string
	status?: NodeResponseStatus
	total_simulations?: number
	simulation_completed?: number
	test_results?: TestResults
	startTime?: Date
	percentage?: number
	nodeResponse?: NodeResponse
}

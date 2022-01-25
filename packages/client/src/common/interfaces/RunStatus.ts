/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { NodeResponseStatus } from '~enums'
import { RunTime } from './RunTime'

export interface RunStatus {
	percentage: number
	estimated_effect_completed: string
	refute_completed: string
	confidence_interval_completed: string
	status: NodeResponseStatus
	time?: RunTime
	error?: string
	estimators?: { status: string }
	refuters?: { status: string }
	confidenceIntervals?: { status: string }
}

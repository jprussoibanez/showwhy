/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Definition, CausalFactor } from '~types'
import type { Maybe, Setter } from '@showwhy/types'

export type InputRef = React.RefObject<HTMLInputElement>

export type SetModelVariables = Setter<Maybe<Definition>>

export type SetEditingDefinition = Setter<Maybe<CausalFactor>>

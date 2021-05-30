import { Dispatch, useDebugValue, useMemo, useReducer } from 'react';

export type CaseReducer<State, Action = any> = (state: State, action: Action) => State;
type PayloadAction<Payload = any> = { type: string; payload: Payload };
type SliceCaseReducers<State> = Record<string, CaseReducer<State, any>>;
type PayloadTuple<T> = T extends undefined ? [] : [T];
type Action<Payload = undefined> = (...payload: PayloadTuple<Payload>) => void;

export type Actions<CaseReducers extends SliceCaseReducers<any>> = {
	[ActionType in keyof CaseReducers]: Action<Parameters<CaseReducers[ActionType]>[1]>;
};

export interface Slice<
	State = any,
	CaseReducers extends SliceCaseReducers<State> = SliceCaseReducers<State>
> {
	name?: string;
	initialState: State;
	reducers: CaseReducers;
}

export type StateAndSpreadActions<SliceT extends Slice> = {
	state: SliceT['initialState'];
} & Actions<SliceT['reducers']>;

export type SpreadStateAndActions<SliceT extends Slice> = SliceT['initialState'] & {
	actions: Actions<SliceT['reducers']>;
};

export type CombineStateAndActions<SliceT extends Slice> = SliceT['initialState'] &
	Actions<SliceT['reducers']>;

function generateReducer(reducers: SliceCaseReducers<any>) {
	return (state: any, action: PayloadAction<any>) => {
		const reducer = reducers[action.type];
		return reducer(state, action.payload);
	};
}

function generateActions<R extends SliceCaseReducers<any> = SliceCaseReducers<any>>(
	reducers: R,
	dispatch: Dispatch<PayloadAction<any>>
): Actions<R> {
	const actionTypes = Object.keys(reducers);
	let actions: Actions<R> = {} as Actions<R>;

	for (let i = 0; i < actionTypes.length; i++) {
		const actionType: keyof typeof reducers = actionTypes[i];

		const actionFunction = (...payload: any[]) => {
			dispatch({ type: actionType, payload: payload[0] });
		};

		actions[actionType] = actionFunction;
	}

	return actions;
}

export function createSlice<State, CaseReducers extends SliceCaseReducers<State>>(
	slice: Slice<State, CaseReducers>
) {
	return slice;
}

export function useSlice<State, CaseReducers extends SliceCaseReducers<State>>({
	name,
	initialState,
	reducers
}: Slice<State, CaseReducers>): [State, Actions<CaseReducers>] {
	const reducer = useMemo(() => generateReducer(reducers), []);
	const [state, dispatch] = useReducer(reducer, initialState);
	const actions = useMemo(() => generateActions(reducers, dispatch), []);

	useDebugValue(name);

	return [state, actions];
}

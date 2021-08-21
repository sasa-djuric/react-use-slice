# react-use-slice

A react hook to use reducers with an API like createSlice from Redux toolkit, in a typesafe way, with performance in mind.

## Install

```sh
npm install react-use-slice
```

## Example

#### JavaScript

```js
import { createContext } from 'react';
import useSlice from 'react-use-slice';

const initialState = {
	score: 0
};

const scoreSlice = {
	name: 'score', // "name" is optional. It is used in dev tools
	initialState,
	reducers: {
		increment(state, payload) {
			const score = state.score + 1;
			return { ...state, score };
		},
		decrement(state, payload) {
			const score = state.score - 1;
			return { ...state, score };
		}
	}
};

export const ScoreContext = createContext(null);

export const ScoreProvider = ({ children }) => {
	// Actions will be automaticaly dispatched
	const [state, actions] = useSlice(scoreSlice);

	return (
		<ScoreContext.Provider value={{ ...state, ...actions }}>
			{children}
		</ScoreContext.Provider>
	);
};
```

#### TypeScript

```ts
import { createContext } from 'react';
import useSlice, { createSlice, CombineStateAndActions } from 'react-use-slice';

const initialState = {
	score: 0
};

const scoreSlice = createSlice({
	name: 'score', // "name" is optional. It is used in dev tools
	initialState,
	reducers: {
		increment(state, payload: number) {
			const score = state.score + 1;
			return { ...state, score };
		},
		decrement(state, payload: number) {
			const score = state.score - 1;
			return { ...state, score };
		}
	}
});

export const ScoreContext =
	createContext<CombineStateAndActions<typeof scoreSlice> | null>(null);

export const ScoreProvider = ({ children }) => {
	// Actions will be automaticaly dispatched
	const [state, actions] = useSlice(scoreSlice);

	return (
		<ScoreContext.Provider value={{ ...state, ...actions }}>
			{children}
		</ScoreContext.Provider>
	);
};
```
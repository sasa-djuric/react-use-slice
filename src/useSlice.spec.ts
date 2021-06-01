import { renderHook, act } from '@testing-library/react-hooks';
import useSlice, { createSlice } from './useSlice';

describe('basic functionality', () => {
	it('should have initial state', () => {
		const initialState = {
			test: 'state'
		};

		const slice = createSlice({
			initialState,
			reducers: {
				test(state, payload) {
					return { ...state, test: payload };
				}
			}
		});

		const { result } = renderHook(() => useSlice(slice));

		expect(result.current[0]).toMatchObject(initialState);
	});

	it('should contain reducers as functions', () => {
		const initialState = {
			test: 'state'
		};

		const slice = createSlice({
			initialState,
			reducers: {
				test(state, payload) {
					return { ...state, test: payload };
				},
				testing(state, payload) {
					return { ...state, test: payload };
				}
			}
		});

		const { result } = renderHook(() => useSlice(slice));

		expect(result.current[1]).toHaveProperty('test');
		expect(result.current[1]).toHaveProperty('testing');
		expect(typeof result.current[1].test).toBe('function');
		expect(typeof result.current[1].testing).toBe('function');
	});

	it('should change state', () => {
		const slice = createSlice({
			initialState: {
				test: 'state'
			},
			reducers: {
				test(state, payload) {
					return { ...state, test: payload };
				}
			}
		});

		const { result } = renderHook(() => useSlice(slice));

		act(() => {
			result.current[1].test('new state');
		});

		expect(result.current[0].test).toBe('new state');
	});

	it('should change complex state', () => {
		const slice = createSlice({
			initialState: {
				test: 'state',
				incrementMe: 0,
				object: {
					state: 'test'
				}
			},
			reducers: {
				test(state, payload) {
					return { ...state, test: payload };
				},
				increment(state, payload) {
					return { ...state, incrementMe: state.incrementMe + payload };
				},
				changeState(state, payload) {
					return { ...state, object: { ...state.object, state: payload } };
				}
			}
		});

		const { result } = renderHook(() => useSlice(slice));

		act(() => {
			result.current[1].test('new state');
			result.current[1].increment(1);
			result.current[1].increment(3);
			result.current[1].changeState('testing');
			result.current[1].test('final state');
		});

		expect(result.current[0]).toMatchObject({
			test: 'final state',
			incrementMe: 4,
			object: {
				state: 'testing'
			}
		});
	});
});

describe('performance', () => {
	it('should keep initial actions instance', () => {
		const slice = createSlice({
			initialState: {
				test: 'state'
			},
			reducers: {
				test(state, payload) {
					return { ...state, test: payload };
				}
			}
		});

		const { result, rerender } = renderHook(() => useSlice(slice));

		const firstResult = result.current[1];

		act(() => {
			result.current[1].test('new state');
		});

		rerender();

		const secondResult = result.current[1];

		expect(firstResult).toBe(secondResult);
	});
});

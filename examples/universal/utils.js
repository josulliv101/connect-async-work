export function delay (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function batchAsyncWork(notify, state) {

	if (!state || !state.asyncwork || !state.asyncwork.loadState) return

	const { loadState } =  state.asyncwork

	const loading = Object.keys(loadState).some(key => loadState[key] && loadState[key].loading)
	
	if (!loading) notify()
}

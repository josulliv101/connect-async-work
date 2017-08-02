export function delay (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}


export function devtools() {
	return typeof window === 'object' && window.devToolsExtension
		? window.devToolsExtension
		: () => noop => noop
} 
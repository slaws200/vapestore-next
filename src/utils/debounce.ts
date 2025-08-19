export function debounce<T extends (...args: unknown[]) => unknown>(
  callee: T,
  timeoutMs: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let lastCallTimer: NodeJS.Timeout | undefined;

  return function perform(...args: Parameters<T>) {
    const currentCall = Date.now();

    if (lastCall && currentCall - lastCall <= timeoutMs) {
      if (lastCallTimer) {
        clearTimeout(lastCallTimer);
      }
    }

    lastCall = currentCall;
    lastCallTimer = setTimeout(() => callee(...args), timeoutMs);
  };
}

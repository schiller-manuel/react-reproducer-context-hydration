import {
  createContext,
  useEffect,
  useReducer,
  Suspense,
  lazy,
  memo,
  startTransition
} from "react";

/**
 * MINIMAL REPRODUCTION: React hydration bug with context + memo + dehydrated Suspense
 *
 * Bug: When a context provider re-renders (via useEffect) during hydration,
 * and there's a React.memo component between the provider and a dehydrated
 * Suspense boundary, React's propagateContextChanges incorrectly marks the
 * Suspense boundary's lanes, causing it to abort hydration and show the fallback.
 *
 * Related: https://github.com/facebook/react/issues/22692
 * Affects: TanStack Router/Start (https://github.com/TanStack/router/issues/6767)
 *
 * Requirements to trigger:
 *   1. Server uses onAllReady (sends <!--$--> resolved boundaries)
 *   2. Context.Provider + useEffect that changes the context value during hydration
 *   3. React.memo between the provider and the Suspense boundary
 *   4. React.lazy inside a Suspense boundary (lazy module not yet loaded on client)
 */

const MyContext = createContext(0);

function RerenderingProvider({ children }) {
  const [value, rerender] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    startTransition(() => {
      rerender();
    });
  }, []);
  return <MyContext value={value}>{children}</MyContext>;
}

function HelloWorld() {
  return <div id="content">Hello world</div>;
}

const LazyHelloWorld = lazy(
  () =>
    new Promise((resolve) =>
      setTimeout(() => resolve({ default: HelloWorld }), 5000),
    ),
);

const MemoWrapper = memo(function MemoWrapper({ children }) {
  return children;
});

export default function App() {
  return (
    <RerenderingProvider>
      <MemoWrapper>
        <Suspense fallback={<div id="fallback">Loading...</div>}>
          <LazyHelloWorld />
        </Suspense>
      </MemoWrapper>
    </RerenderingProvider>
  );
}

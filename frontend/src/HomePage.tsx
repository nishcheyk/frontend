import React, { useState, useEffect, useRef } from "react";
import { ThemeProvider } from "styled-components";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { useSpring, animated, useTransition, config } from "react-spring";
import { FiSun, FiMoon } from "react-icons/fi";
import { ErrorBoundary } from "react-error-boundary";
import { lightTheme, darkTheme } from "./theme";

// ===== Global Styles =====
const GlobalStyle = createGlobalStyle`
  body, html, #root {
    margin: 0; padding: 0; height: 100%;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    overflow: hidden; /* we'll scroll inside Container */
  }
`;

const FixedBackground = styled.div`
  position: fixed;
  inset: 0;
  background-image: url("https://images.unsplash.com/photo-1506744038136-46273834b3fb");
  background-position: center;
  background-size: cover;
  filter: brightness(0.5);
  z-index: -1;
`;

const NavbarWrapper = styled(animated.nav)<{ $scrolled: boolean }>`
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 12px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  font-size: 1.4rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: saturate(180%) blur(10px);
  box-shadow: ${({ $scrolled }) =>
    $scrolled ? "0 4px 12px rgba(0,0,0,0.15)" : "none"};
  transition: box-shadow 0.3s ease;
`;

const ToggleButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 24px;
  border: none;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  &:hover,
  &:focus-visible {
    background-color: ${({ theme }) => theme.colors.secondary};
    transform: scale(1.05);
    outline: none;
  }
  svg {
    font-size: 1.3rem;
  }
`;

const Container = styled.main`
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px 64px;
  box-sizing: border-box;
  height: 100vh;
  overflow-y: auto;
`;

const ContentSection = styled.section`
  margin-top: 24px;
  padding-bottom: 200px; /* so bottom content can fully scroll */
`;

const BaseAccordionItem = styled.div`
  margin-bottom: 24px;
  border-radius: 12px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.accentBg};
  border: 1px solid ${({ theme }) => theme.colors.accentBorder};
`;

const AccordionItemWrapper = styled(BaseAccordionItem)`
  cursor: pointer;
  user-select: none;
  &:hover,
  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const AccordionHeader = styled.div<{ $isOpen: boolean }>`
  padding: 20px 28px;
  font-size: 1.4rem;
  font-weight: 600;
  color: ${({ theme, $isOpen }) =>
    $isOpen ? theme.colors.primary : theme.colors.text};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AccordionContentWrapper = styled(animated.div)`
  padding: 0 28px 20px;
  font-size: 1.05rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  overflow: hidden;
`;

const skeletonShimmer = keyframes`
  from { background-position: -200px 0; }
  to { background-position: 200px 0; }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #ddd 25%, #eee 50%, #ddd 75%);
  background-size: 400% 100%;
  animation: ${skeletonShimmer} 1.2s linear infinite;
  border-radius: 6px;
  margin: 8px 0;
`;

const SkeletonHeader = styled(SkeletonBase)`
  height: 32px;
  width: 60%;
`;
const SkeletonContentLine = styled(SkeletonBase)`
  height: 14px;
  margin-top: 12px;
`;
const SkeletonAccordionItem = styled(BaseAccordionItem)`
  padding: 20px 28px;
`;

const SkeletonAccordion = () => (
  <>
    {Array.from({ length: 3 }).map((_, i) => (
      <SkeletonAccordionItem key={i}>
        <SkeletonHeader />
        <SkeletonContentLine />
        <SkeletonContentLine />
      </SkeletonAccordionItem>
    ))}
  </>
);

const ScrollProgressBar = styled(animated.div)`
  position: fixed;
  top: 0;
  left: 0;
  height: 8px;
  background: red; /* debug color now, change to gradient later */
  transform-origin: left;
  width: 0%;
  z-index: 999999; /* above everything */
`;

const ErrorFallback = ({
  errorMessage,
  onRetry,
}: {
  errorMessage: string;
  onRetry: () => void;
}) => (
  <BaseAccordionItem role="alert" style={{ padding: 16, color: "#721c24" }}>
    <strong>Something went wrong.</strong>
    <pre>{errorMessage}</pre>
    <button onClick={onRetry}>Retry</button>
  </BaseAccordionItem>
);

const ErrorTrigger = () => {
  const [throwError, setThrowError] = useState(false);
  if (throwError) throw new Error("Test error triggered!");
  return <button onClick={() => setThrowError(true)}>Trigger Error</button>;
};

const AccordionItem: React.FC<{ header: string; content: React.ReactNode }> = ({
  header,
  content,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const transitions = useTransition(isOpen ? [content] : [], {
    from: { maxHeight: 0, opacity: 0 },
    enter: { maxHeight: 1000, opacity: 1 },
    leave: { maxHeight: 0, opacity: 0 },
    config: config.stiff,
  });
  return (
    <AccordionItemWrapper>
      <AccordionHeader $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        {header}
        <span>{isOpen ? "▲" : "▼"}</span>
      </AccordionHeader>
      {transitions(
        (style, item) =>
          item && (
            <AccordionContentWrapper style={style}>
              {item}
            </AccordionContentWrapper>
          )
      )}
    </AccordionItemWrapper>
  );
};

const Navbar = ({
  isScrolled,
  toggleTheme,
  isDark,
}: {
  isScrolled: boolean;
  toggleTheme: () => void;
  isDark: boolean;
}) => {
  const springStyles = useSpring({
    from: { y: -60, opacity: 0 },
    to: { y: 0, opacity: 1 },
  });
  return (
    <NavbarWrapper $scrolled={isScrolled} style={springStyles}>
      My Modern Vite PWA
      <ToggleButton onClick={toggleTheme}>
        {isDark ? <FiSun /> : <FiMoon />} Switch to {isDark ? "Light" : "Dark"}{" "}
        Mode
      </ToggleButton>
    </NavbarWrapper>
  );
};

const HomePage = () => {
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const docHeight = el.scrollHeight - el.clientHeight;
      const progress = docHeight > 0 ? el.scrollTop / docHeight : 0;
      setScrollProgress(progress);
      setScrolled(el.scrollTop > 20);
      console.log("Progress:", progress);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const progressBarStyle = useSpring({
    width: `${scrollProgress * 100}%`,
    config: config.gentle,
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const mockItems = [
    {
      header: "How to Prepare an Impactful Resume for IT Freshers",
      content: <p>Highlight projects and internships...</p>,
    },
    { header: "Test Error Boundary", content: <ErrorTrigger /> },
    {
      header: "Top Programming Languages to Master for 2025",
      content: <p>Start with Python and JavaScript...</p>,
    },
    {
      header: "Top Programming Languages to Master for 2025",
      content: <p>Start with Python and JavaScript...</p>,
    },
    {
      header: "Top Programming Languages to Master for 2025",
      content: <p>Start with Python and JavaScript...</p>,
    },

    {
      header: "Top Programming Languages to Master for 2025",
      content: <p>Start with Python and JavaScript...</p>,
    },
    {
      header: "Top Programming Languages to Master for 2025",
      content: <p>Start with Python and JavaScript...</p>,
    },
    {
      header: "Top Programming Languages to Master for 2025",
      content: <p>Start with Python and JavaScript...</p>,
    },
    {
      header: "Top Programming Languages to Master for 2025",
      content: <p>Start with Python and JavaScript...</p>,
    },
    {
      header: "Top Programming Languages to Master for 2025",
      content: <p>Start with Python and JavaScript...</p>,
    },

    {
      header: "Top Programming Languages to Master for 2025",
      content: <p>Start with Python and JavaScript...</p>,
    },
    {
      header: "Top Programming Languages to Master for 2025",
      content: <p>Start with Python and JavaScript...</p>,
    },
    {
      header: "Top Programming Languages to Master for 2025",
      content: <p>Start with Python and JavaScript...</p>,
    },
    {
      header: "Top Programming Languages to Master for 2025",
      content: <p>Start with Python and JavaScript...</p>,
    },
    {
      header: "Top Programming Languages to Master for 2025",
      content: <p>Start with Python and JavaScript...</p>,
    },
    {
      header: "Top Programming Languages to Master for 2025",
      content: <p>Start with Python and JavaScript...</p>,
    },

    {
      header: "Top Programming Languages to Master for 2025",
      content: <p>Start with Python and JavaScript...</p>,
    },
    {
      header: "Top Programming Languages to Master for 2025",
      content: <p>Start with Python and JavaScript...</p>,
    },
    {
      header: "Top Programming Languages to Master for 2025",
      content: <p>Start with Python and JavaScript...</p>,
    },
    {
      header: "Top Programming Languages to Master for 2025",
      content: <p>Start with Python and JavaScript...</p>,
    },
    {
      header: "Top Programming Languages to Master for 2025",
      content: <p>Start with Python and JavaScript...</p>,
    },
    {
      header: "Top Programming Languages to Master for 2025",
      content: <p>Start with Python and JavaScript...</p>,
    },
    {
      header: "Top Programming Languages to Master for 2025",
      content: <p>Start with Python and JavaScript...</p>,
    },
  ];

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyle />
      <FixedBackground />
      <Navbar
        isScrolled={scrolled}
        toggleTheme={() => setIsDark(!isDark)}
        isDark={isDark}
      />
      <ScrollProgressBar style={progressBarStyle} />
      <Container ref={scrollRef}>
        <ContentSection>
          {loading ? (
            <SkeletonAccordion />
          ) : (
            mockItems.map((item, idx) => (
              <ErrorBoundary
                key={idx}
                FallbackComponent={({ error, resetErrorBoundary }) => (
                  <ErrorFallback
                    errorMessage={error.message}
                    onRetry={resetErrorBoundary}
                  />
                )}
              >
                <AccordionItem header={item.header} content={item.content} />
              </ErrorBoundary>
            ))
          )}
        </ContentSection>
      </Container>
    </ThemeProvider>
  );
};

export default HomePage;

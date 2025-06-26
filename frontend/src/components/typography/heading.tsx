import styled from "@emotion/styled";

interface HeadingProps {
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  weight?: "normal" | "medium" | "semibold" | "bold" | "extrabold";
  align?: "left" | "center" | "right";
  gradient?: boolean;
}

const getFontSize = (size?: string) => {
  switch (size) {
    case "xs": return "0.75rem";
    case "sm": return "0.875rem";
    case "md": return "1rem";
    case "lg": return "1.125rem";
    case "xl": return "1.25rem";
    case "2xl": return "1.5rem";
    case "3xl": return "1.875rem";
    default: return "1.5rem";
  }
};

const getFontWeight = (weight?: string) => {
  switch (weight) {
    case "normal": return "400";
    case "medium": return "500";
    case "semibold": return "600";
    case "bold": return "700";
    case "extrabold": return "800";
    default: return "700";
  }
};

export const Heading = styled.h1<HeadingProps>`
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: ${props => getFontSize(props.size)};
  font-weight: ${props => getFontWeight(props.weight)};
  line-height: 1.2;
  margin: 0;
  text-align: ${props => props.align || "left"};
  color: var(--text-primary);
  
  ${props => props.gradient && `
    background: linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  `}
  
  @media (max-width: 768px) {
    font-size: ${props => {
      const size = props.size || "2xl";
      if (size === "3xl") return "1.5rem";
      if (size === "2xl") return "1.25rem";
      if (size === "xl") return "1.125rem";
      return getFontSize(size);
    }};
  }
`;


import styled from "@emotion/styled";

interface TextProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?: "primary" | "secondary" | "muted" | "accent";
  align?: "left" | "center" | "right";
  lineHeight?: "tight" | "normal" | "relaxed";
}

const getFontSize = (size?: string) => {
  switch (size) {
    case "xs": return "0.75rem";
    case "sm": return "0.875rem";
    case "md": return "1rem";
    case "lg": return "1.125rem";
    case "xl": return "1.25rem";
    default: return "1rem";
  }
};

const getFontWeight = (weight?: string) => {
  switch (weight) {
    case "normal": return "400";
    case "medium": return "500";
    case "semibold": return "600";
    case "bold": return "700";
    default: return "400";
  }
};

const getTextColor = (color?: string) => {
  switch (color) {
    case "primary": return "var(--text-primary)";
    case "secondary": return "var(--text-secondary)";
    case "muted": return "var(--text-muted)";
    case "accent": return "var(--text-accent)";
    default: return "var(--text-primary)";
  }
};

const getLineHeight = (lineHeight?: string) => {
  switch (lineHeight) {
    case "tight": return "1.25";
    case "normal": return "1.5";
    case "relaxed": return "1.75";
    default: return "1.5";
  }
};

export const Text = styled.p<TextProps>`
  font-family: "Onest", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: ${props => getFontSize(props.size)};
  font-weight: ${props => getFontWeight(props.weight)};
  line-height: ${props => getLineHeight(props.lineHeight)};
  margin: 0;
  text-align: ${props => props.align || "left"};
  color: ${props => getTextColor(props.color)};
`;


import styled from "@emotion/styled";
import {
  LoadingSpinner,
  LoadingDots,
  LoadingText,
  LoadingSubtext,
  StateContainer,
} from "../../../pages/lobby/lobby.styled";

export type LoaderType = "spinner" | "dots";

interface LoaderProps {
  type?: LoaderType;
  title?: string;
  subtitle?: string;
  size?: "small" | "medium" | "large";
  centered?: boolean;
}

const SmallSpinner = styled(LoadingSpinner)`
  width: 30px;
  height: 30px;
  border-width: 2px;
`;

const LargeSpinner = styled(LoadingSpinner)`
  width: 80px;
  height: 80px;
  border-width: 6px;
`;

const SmallDots = styled(LoadingDots)`
  span {
    width: 8px;
    height: 8px;
  }
`;

const LargeDots = styled(LoadingDots)`
  span {
    width: 16px;
    height: 16px;
  }
`;

export const Loader = ({
  type = "spinner",
  title = "Loading...",
  subtitle,
  size = "medium",
  centered = true,
}: LoaderProps) => {
  const renderLoader = () => {
    if (type === "spinner") {
      switch (size) {
        case "small":
          return <SmallSpinner />;
        case "large":
          return <LargeSpinner />;
        default:
          return <LoadingSpinner />;
      }
    } else {
      switch (size) {
        case "small":
          return (
            <SmallDots>
              <span></span>
              <span></span>
              <span></span>
            </SmallDots>
          );
        case "large":
          return (
            <LargeDots>
              <span></span>
              <span></span>
              <span></span>
            </LargeDots>
          );
        default:
          return (
            <LoadingDots>
              <span></span>
              <span></span>
              <span></span>
            </LoadingDots>
          );
      }
    }
  };

  const content = (
    <>
      {renderLoader()}
      {title && <LoadingText>{title}</LoadingText>}
      {subtitle && <LoadingSubtext>{subtitle}</LoadingSubtext>}
    </>
  );

  if (centered) {
    return <StateContainer>{content}</StateContainer>;
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {content}
    </div>
  );
};

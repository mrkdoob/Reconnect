import React from "react"
import { Flex, Box, Text } from "@chakra-ui/core"
import { CourseLevelFragment } from "../lib/graphql"
import { styled } from "./providers/ThemeProvider"
import gql from "graphql-tag.macro"
import { Lock } from "styled-icons/boxicons-solid/Lock"

export const COURSE_LEVEL = gql`
  fragment CourseLevel on Level {
    id
    title
    cover
    levelNumber
    maxProgressDays
  }
`

interface Props {
  level: CourseLevelFragment
}

const colors = ["blue.400", "blue.200", "green.100", "green.400"] // TODO: Add more colors when using more levels

export function CourseLevelItem(props: Props) {
  return (
    <StyledLevelFlex
      mb={{ base: 4, md: 10 }}
      h={{ base: "32", md: "9rem" }}
      w={{ base: "95vw", md: "420px" }}
      bg={colors[props.level.levelNumber - 1]}
      borderRadius="lg"
    >
      <StyledImageBox
        backgroundImage={`url("${props.level?.cover}")` || ""}
        w={{ base: 32, md: "9rem" }}
        align="center"
        justify="center"
      >
        {props.level.levelNumber !== 1 && <Box as={Lock} height={10} mr={4} />}
      </StyledImageBox>
      {/* <Box
        w="4px"
        position="absolute"
        h="4rem"
        right="Calc(225px - 4rem)"
        top="9rem"
        bg={colors[props.level.levelNumber - 1]}
      /> */}

      <StyledContentFlex
        w={{ base: "Calc(100% - 7rem)", md: "Calc(450px - 8rem)" }}
        pl={{ base: 4, md: 8 }}
        direction="column"
        justify="center"
        borderRadius="lg"
      >
        <Text>Level {props.level.levelNumber}</Text>
        <Text fontWeight="semibold">{props.level.title}</Text>
        <StyledUppercasedText>
          0 / {props.level.maxProgressDays} steps completed
        </StyledUppercasedText>
      </StyledContentFlex>
    </StyledLevelFlex>
  )
}

const StyledLevelFlex = styled(Flex)`
  position: relative;
  color: ${p => p.theme.colors.white};
`

const StyledImageBox = styled(Flex)`
  border-radius: ${p => p.theme.radii.lg};
  height: 100%;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
`
const StyledContentFlex = styled(Flex)`
  height: 100%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`

const StyledUppercasedText = styled(Text)`
  text-transform: uppercase;
  letter-spacing: 0.125rem;
  margin-top: ${p => p.theme.space[1]};
  font-size: ${p => p.theme.fontSizes.xs};
`
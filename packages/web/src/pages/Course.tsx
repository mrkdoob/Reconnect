import React from "react"
import { RouteComponentProps, Link, Redirect } from "@reach/router"

import { Page } from "../components/Page"
import gql from "graphql-tag.macro"
import {
  CourseItemFragmentDoc,
  CourseFragmentDoc,
  useGetCourseQuery,
  CourseLevelFragmentDoc,
} from "../lib/graphql"
import { Flex, Text, Box, Heading, Button, Image } from "@chakra-ui/core"
import { styled } from "../components/providers/ThemeProvider"

import { Border } from "../components/Border"
import { CourseLevelList } from "../components/CourseLevelList"
import { CourseLeadIn } from "../components/CourseLeadIn"
import { Markup } from "interweave"
import { useMe } from "../components/providers/MeProvider"

export const COURSE = gql`
  fragment Course on Course {
    levels {
      ...CourseLevel
    }
    ...CourseItem
  }
  ${CourseItemFragmentDoc}
  ${CourseLevelFragmentDoc}
`

export const GET_COURSE = gql`
  query GetCourse($slug: String!) {
    courseBySlug(slug: $slug) {
      ...Course
    }
  }
  ${CourseFragmentDoc}
`

interface Props extends RouteComponentProps<{ slug: string }> {}

export const Course: React.FC<Props> = props => {
  const slug = props.slug as string
  const { data, loading } = useGetCourseQuery({ variables: { slug } })
  const course = data?.courseBySlug
  const me = useMe()

  if (me && me.id === course?.mentor?.id) {
    return <Redirect noThrow to={"/admin-courses/" + slug} />
  } else {
    return (
      <Page disableRedirect={true} loading={loading}>
        {course ? (
          <>
            {/* Banner */}
            <StyledCoverBox
              rounded="lg"
              backgroundImage={`url("${course?.cover}")` || ""}
              mt={{ base: 8, md: 0 }}
            >
              <Box
                rounded="lg"
                bg="black"
                // @ts-ignore
                opacity="0.2"
                w="100%"
                h="100%"
                position="absolute"
              />
              <Flex
                direction="column"
                h="100%"
                w="100%"
                justify="center"
                align="center"
                textAlign="center"
                // @ts-ignore
                opacity="0.99"
              >
                {/* TODO: Fix text readability */}
                <Text
                  textTransform="uppercase"
                  letterSpacing="0.25rem"
                  fontSize="xs"
                  fontWeight="semibold"
                  mb={2}
                >
                  {course?.category}
                </Text>
                <Heading mb={3} fontWeight="normal">
                  {course?.name}
                </Heading>
                <Text mb={4}>{course?.description}</Text>
                <Link to={`/${course?.slug}/groups`}>
                  <Button variantColor="gray" px={8}>
                    <Text
                      textTransform="uppercase"
                      letterSpacing="0.125rem"
                      fontSize="xs"
                      color="text"
                    >
                      Start now
                    </Text>
                  </Button>
                </Link>
              </Flex>
            </StyledCoverBox>

            {/* Lead in*/}
            <CourseLeadIn course={course} />

            {/* Full description */}
            <Flex justify="center" align="center" mt={{ base: 0, md: 12 }}>
              <Box w={["100%", "70%"]}>
                <Border mb={{ base: 12, md: 20 }} mt={8} />
                {/* Description */}
                <Box px={4} fontSize="lg">
                  <Markup content={course?.fullDescription} />
                </Box>
                {/* Mentor */}
                {course.mentor && (
                  <>
                    <Border my={{ base: 12, md: 20 }} mt={8} />
                    <Flex
                      px={4}
                      fontSize="lg"
                      justify="center"
                      align="center"
                      direction={{ base: "column", md: "row" }}
                    >
                      {course.mentor.avatar && (
                        <Image
                          src={course.mentor?.avatar}
                          size={24}
                          rounded="full"
                          mr={{ base: 0, md: 8 }}
                          mb={{ base: 8, md: 0 }}
                        />
                      )}
                      <Box>
                        <Text fontWeight="semibold">
                          Created by {course.mentor.fullName}
                        </Text>
                        <Markup content={course.mentor.bio} />
                      </Box>
                    </Flex>
                  </>
                )}
              </Box>
            </Flex>

            {/* Level path */}
            <CourseLevelList course={course} />
          </>
        ) : (
          <Flex align="center" justify="center">
            <Text>No course found</Text>
          </Flex>
        )}
      </Page>
    )
  }
}

const StyledCoverBox = styled(Box)`
  position: relative;
  height: 40vh;
  width: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  color: ${p => p.theme.colors.white};
`

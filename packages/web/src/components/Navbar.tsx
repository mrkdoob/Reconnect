import React from "react"
import {
  Link,
  Stack,
  Button,
  Text,
  Icon,
  Flex,
  Box,
  Collapse,
} from "@chakra-ui/core"
import { Link as RLink, Match } from "@reach/router"

import { useLogout } from "../lib/hooks/useLogout"
import { styled } from "./providers/ThemeProvider"
import { useToggle } from "../lib/hooks/useToggle"

import { Menu } from "styled-icons/boxicons-regular/Menu"
import { Close } from "styled-icons/material/Close"
import { useMe } from "./providers/MeProvider"
import { User } from "styled-icons/boxicons-regular/User"
import { colors } from "../lib/colors"
import { ProfilePhoto } from "./ProfilePhoto"

export const Navbar: React.FC = () => {
  const me = useMe()
  const [menuOpen, toggleMenu] = useToggle({ default: false })
  const [userMenuOpen, toggleUserMenu] = useToggle({ default: false })

  const logout = useLogout()

  return (
    <>
      <StyledSidebar
        p={{ base: 2, lg: 3 }}
        display={{ base: "none", md: "flex" }}
      >
        {/* <Image
          src="https://cdn.dribbble.com/users/60166/screenshots/6352895/new_wave.jpg"
          h={12}
          w={16}
        /> */}
        <Flex fontSize="xl">
          <Text color={colors[0]}>B</Text>
          <Text color={colors[1]}>e</Text>
          <Text color={colors[2]}>co</Text>
          <Text color={colors[3]}>me</Text>
          {/* </Flex>
        <Flex fontSize="xl" mt={-2}> */}
          {/* <Text color={colors[0]} ml={2}>
            a b
          </Text>
          <Text color={colors[1]}>et</Text>
          <Text color={colors[2]}>ter</Text>
          <Text color={colors[3]}>.me</Text> */}
        </Flex>

        {/* Md+ */}
        <Flex align="center" justify="space-between" w="15rem">
          {!me ? (
            <>
              <NavLink to="/courses">
                <Text>Challenges</Text>
              </NavLink>
              <NavLink to="/login">
                <Button variant="link" color="gray.400">
                  <Text>Log in</Text>
                </Button>
              </NavLink>
              <NavLink to="/register">
                <Button variant="link" color="gray.400">
                  <Text>Sign up</Text>
                </Button>
              </NavLink>
            </>
          ) : (
            <>
              <Text>
                <NavLink to="/dashboard">Home</NavLink>
              </Text>
              {me.groupId ? (
                <Text>
                  <NavLink to="/mylevelreward">Lesson</NavLink>
                </Text>
              ) : (
                <NavLink to="/courses">
                  <Text>Challenges</Text>
                </NavLink>
              )}
              {me.role === "admin" && (
                <NavLink to="/admin-courses">
                  <Text>Admin</Text>
                </NavLink>
              )}
            </>
          )}
          {me?.avatar && me.avatar ? (
            <ProfilePhoto
              src={me.avatar}
              size="40px"
              rounded="full"
              onClick={toggleUserMenu}
              objectFit="cover"
              cursor="pointer"
            />
          ) : (
            me && (
              <Box
                cursor="pointer"
                onClick={toggleUserMenu}
                as={User}
                h={8}
                color="gray.300"
              />
            )
          )}
        </Flex>
      </StyledSidebar>
      <Collapse
        as={Flex}
        isOpen={userMenuOpen}
        alignItems="center"
        position="fixed"
        top="60px"
        right="0"
        bg="white"
        zIndex={999}
        borderRadius="lg"
      >
        <StyledStack
          p={6}
          spacing={6}
          fontWeight="bold"
          align="flex-start"
          borderRadius="lg"
        >
          {/* TODO: <Text onClick={toggleUserMenu}>
            <NavLink to="/progress">My progress</NavLink>
          </Text> */}
          <Text onClick={toggleUserMenu}>
            <NavLink to="/courses">Challenges</NavLink>
          </Text>
          <Text onClick={toggleUserMenu}>
            <NavLink to="/create-challenge">Create your own challenge</NavLink>
          </Text>
          <Text onClick={toggleUserMenu}>
            <NavLink to="/settings">Settings</NavLink>
          </Text>

          <Button
            variant="link"
            onClick={() => {
              logout()
              toggleUserMenu()
            }}
            color="gray.400"
          >
            <Icon name="external-link" mr={{ base: 0, lg: 2 }} />
            <Text>Logout</Text>
          </Button>
        </StyledStack>
      </Collapse>

      {/* Mobile screen */}
      <StyledSidebar display={{ base: "flex", lg: "none" }} p={4}>
        <Flex fontSize="xl">
          <Text color={colors[0]}>B</Text>
          <Text color={colors[1]}>e</Text>
          <Text color={colors[2]}>co</Text>
          <Text color={colors[3]}>me</Text>
        </Flex>
        <Box as={menuOpen ? Close : Menu} h={8} onClick={toggleMenu} />
      </StyledSidebar>
      <Collapse
        as={Flex}
        isOpen={menuOpen}
        h="calc(100vh - 60px)"
        w="100vw"
        justifyContent="center"
        alignItems="center"
        position="fixed"
        top="60px"
        left="0"
        bg="white"
        zIndex={999}
      >
        {me ? (
          <Stack spacing={12} fontWeight="bold" fontSize="xl" align="center">
            <Text onClick={toggleMenu}>
              <NavLink to="/dashboard">Dashboard </NavLink>
            </Text>
            {me.groupId && (
              <Text onClick={toggleMenu}>
                <NavLink to={`/mylevelreward`}>Current lesson</NavLink>
              </Text>
            )}
            <Text onClick={toggleMenu}>
              <NavLink to="/courses">Challenges</NavLink>
            </Text>
            {/* TODO: <Text onClick={toggleMenu}>
              <NavLink to="/progress">My progress</NavLink>
            </Text> */}

            <Text onClick={toggleMenu}>
              <NavLink to="/create-challenge">
                Create your own challenge
              </NavLink>
            </Text>
            <Text onClick={toggleMenu}>
              <NavLink to="/settings">Settings</NavLink>
            </Text>
            <Button
              variant="link"
              onClick={logout && toggleMenu}
              color="gray.400"
            >
              <Icon name="external-link" mr={{ base: 0, lg: 2 }} />
              <Text>Logout</Text>
            </Button>
          </Stack>
        ) : (
          <Stack spacing={12} fontWeight="bold" fontSize="xl" align="center">
            <Text onClick={toggleMenu}>
              <NavLink to="/courses">Challenges</NavLink>
            </Text>
            <Text onClick={toggleMenu}>
              <NavLink to="/login">Log in </NavLink>
            </Text>
            <Text onClick={toggleMenu}>
              <NavLink to="/register">Sign up </NavLink>
            </Text>
          </Stack>
        )}
      </Collapse>
    </>
  )
}

const StyledSidebar = styled(Flex)`
  position: fixed;
  left: 0;
  top: 0;
  height: 60px;
  width: 100vw;
  justify-content: space-between;
  align-items: center;
  background-color: ${p => p.theme.colors.white};
  font-weight: ${p => p.theme.fontWeights.semibold};
  z-index: ${p => p.theme.zIndices.sticky};
  border-bottom: 1px solid ${p => p.theme.colors.gray[100]};
`

const StyledStack = styled(Stack)`
  border: 1px solid ${p => p.theme.colors.gray[100]};
  border-top: 0;
`

const NavLink: React.FC<{ to: string }> = ({ to, children }) => {
  return (
    <Match path={to}>
      {() => (
        // eslint-disable-next-line
        // @ts-ignore
        <Link as={RLink} to={to} display="flex" alignItems="center">
          {children}
        </Link>
      )}
    </Match>
  )
}

import { Container, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <Container maxW={"1140px"} px={4} bg="blue.600" color="white"> {/* Navbar background and text color */}
      <Flex
        h={16}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexDir={{
          base: "column",
          sm: "row",
        }}
        px={4} // Padding inside the Navbar
      >
        <Text
          fontSize={{ base: "22px", sm: "28px" }}
          fontWeight={"bold"}
          textTransform={"uppercase"}
          textAlign={"center"}
        >
          <Link to={"/"} style={{ color: "white", textDecoration: "none" }}> {/* Ensuring link inherits white color */}
            Product Store
          </Link>
        </Text>
        <HStack spacing={2} alignItems={"center"}>
            <Link to={"/create"}>
            <Button>
                <PlusSquareIcon/>
            </Button>

            </Link>
        </HStack>
      </Flex>
    </Container>
  );
};

export default Navbar;
import { Box, Button, Flex, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { ToastContainer, toast } from 'react-toastify';
import { useCallback, useEffect, useRef, useState } from "react";

import 'react-toastify/dist/ReactToastify.css';

type cepInfoType = {
  cep: string,
  logradouro: string,
  complemento: string,
  bairro: string,
  localidade: string,
  uf: string,
  ibge: string,
  gia: string,
  ddd: string,
  siafi: string,
}

function App() {

  // const [inputedCep, setInputedCep] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [cepInfo, setCepInfo] = useState<cepInfoType | void>(undefined)
  const [cepHistory, setCepHistory] = useState<cepInfoType[]>([])

  const inputRef = useRef<HTMLInputElement>(null)


  useEffect(() => {
    const storageHistory = localStorage.getItem("buscaCEP-history")

    if (storageHistory) {
      setCepHistory(JSON.parse(storageHistory))
    }
  }, [])

  const handleCepFromHistory = (selectedCep: cepInfoType) => {
    setCepInfo(selectedCep)
    // setInputedCep("")

    if (inputRef.current) {
      inputRef.current.value = ""
    }

    toast.success(`Cep ${selectedCep.cep} selecionado`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  }


  const handleCepSearch = useCallback(async () => {
    setIsLoading(true)
    setCepInfo(undefined)
    const selectedCepValue = inputRef?.current?.value.replace("-", "")
    // setInputedCep("")

    if (inputRef.current) {
      inputRef.current.value = ""
    }

    const url = `https://viacep.com.br/ws/${selectedCepValue}/json/`


    try {
      const response = await fetch(url)
      const cepDetails = await response.json()

      if (cepDetails?.erro) {
        throw new Error
      }

      setCepInfo(cepDetails)

      const isCepOnHistory = cepHistory?.find(item => item.cep.replace("-", "") === selectedCepValue)

      if (!isCepOnHistory) {
        localStorage.setItem("buscaCEP-history", JSON.stringify([...cepHistory, cepDetails]))
        setCepHistory(old => [...old, cepDetails])
      }

      toast.success('Cep encontrado', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

    } catch {
      toast.error('Não foi possível encontrar o CEP informado, verifique se o formato está certo', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

    } finally {
      setIsLoading(false)
    }
  }, [inputRef, cepHistory, cepInfo, isLoading])

  return (
    <Flex
      minW="100vw"
      minH="100vh"
      p="50px"
      bgColor="gray.300"
      flexDir="column"
      align="center"
      justify="center"
    >
      <Heading mb="20px" color="blue.600">BUSCA CEP</Heading>
      <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' bgColor="white" p="12px" minW="600px">
        <>
          <Heading fontSize="19px">
            Buscar CEP:
          </Heading>
          <Flex justify="center" mt="10px">
            <Input ref={inputRef} placeholder="digite seu cep" mr="5px" />
            <Button colorScheme="blue" isLoading={isLoading} onClick={() => handleCepSearch()} minW="170px">
              Buscar
            </Button>
          </Flex>

          {
            cepInfo && (
              <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' bgColor="white" p="12px" mt="20px" maxWidth="100%">
                <Heading fontSize="19px" mb="10px" color="green.500">
                  Resultado da busca:
                </Heading>
                <Stack color="gray.600">
                  <Box><b>Cep:</b> {cepInfo.cep}</Box>
                  <Box><b>Bairro:</b> {cepInfo.bairro}</Box>
                  <Box><b>Complemento:</b> {cepInfo.complemento}</Box>
                  <Box><b>Localidade:</b> {cepInfo.localidade}</Box>
                  <Box><b>Logradouro:</b> {cepInfo.logradouro}</Box>
                  <Box><b>Uf:</b> {cepInfo.uf}</Box>
                </Stack>
                <Button mt="20px" onClick={() => setCepInfo(undefined)}>
                  Limpar
                </Button>
              </Box>
            )
          }
        </>
      </Box>

      <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' bgColor="whiteAlpha.700" p="12px" minW="600px" mt="20px">
        <Stack>
          <Heading fontSize="19px">
            Histórico
          </Heading>
          <Box>
            {

              cepHistory.length > 0 ? (
                <Stack>
                  {
                    cepHistory.map(item => {
                      return (
                        <Box key={`cep-history-list-item-${item.cep}`}>
                          <Button
                            variant="ghost"
                            color={item.cep === cepInfo?.cep ? "green.400" : "blue.400"}
                            p="0"
                            onClick={() => { handleCepFromHistory(item) }}
                          >
                            {item.cep}
                          </Button>
                        </Box>
                      )
                    })
                  }
                </Stack>
              ) : (
                <Text>
                  Você ainda não tem um histórico...
                </Text>
              )
            }

          </Box>
        </Stack>
      </Box>
      <ToastContainer />
    </Flex>
  )
}

export default App

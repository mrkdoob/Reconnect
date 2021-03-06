import React from "react"
import { Button, Box, Flex } from "@chakra-ui/core"
import { useDropzone } from "react-dropzone"
import gql from "graphql-tag.macro"
import {
  useUpdateSettingsMutation,
  MySettingsDocument,
  MeDocument,
  useGetSignedUrlMutation,
} from "../lib/graphql"
import { formatFileName } from "../lib/helpers"
import { useToast } from "../lib/hooks/useToast"
import { useOpen } from "../lib/hooks/useOpen"
import { amzUrl } from "../lib/uploadPaths"
import { PreviewImage } from "./ImageCreate"

export const GET_SIGNED_S3_URL = gql`
  mutation GetSignedUrl($data: S3SignedUrlInput!) {
    getSignedS3Url(data: $data)
  }
`

interface Props {
  onClose?: () => void
}

// TODO: Use ImageCreate
export const NewAvatar: React.FC<Props> = props => {
  const [images, setImages] = React.useState<File[]>([])
  const [loading, setLoading, setStopLoading] = useOpen()
  const [getSigned] = useGetSignedUrlMutation()
  const [updateSettings] = useUpdateSettingsMutation({
    refetchQueries: [{ query: MeDocument }],
  })
  const toast = useToast()

  const onDrop = React.useCallback((newImages: File[]) => {
    setImages([...newImages])
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  })

  const handleSubmit = async () => {
    try {
      setLoading()
      if (images.length === 0) return
      const imageKey = ``
      const imageData = {
        image: images[0],
        fileType: images[0].type,
        key: imageKey + formatFileName(images[0].name),
      }
      const key = imageKey + formatFileName(images[0].name)
      // GET SIGNED URLS
      const res = await getSigned({
        variables: {
          data: {
            key,
            fileType: images[0].type,
          },
        },
      })

      // UPLOAD TO S3
      if (!res.data?.getSignedS3Url) return
      try {
        const signedRequest = res.data.getSignedS3Url
        await fetch(signedRequest, {
          method: "PUT",
          headers: {
            "Content-Type": images[0].type,
          },
          body: images[0],
        }).catch(() => {
          // TODO: network error
        })
      } catch (error) {
        console.log(error)
      }

      await updateSettings({
        variables: {
          data: {
            avatar: amzUrl + imageData.key,
          },
        },
        refetchQueries: [{ query: MySettingsDocument }],
      }).then(() => {
        props.onClose && props.onClose()
      })
      setStopLoading()
    } catch (error) {
      setStopLoading()
      toast({ status: "error", description: "Error uploading images" })
    }
  }
  return (
    <Box>
      <Box p={2}>
        <Box
          {...getRootProps()}
          textAlign="center"
          cursor="pointer"
          p={2}
          mb={4}
          border="2px dashed"
          borderColor="gray.200"
        >
          <input {...getInputProps()} />
          Drag or click here to upload image
        </Box>
        {images?.length > 0 && (
          <PreviewImage
            src={URL.createObjectURL(images[0])}
            loading={loading}
            onRemove={() => setImages([])}
          />
        )}
      </Box>
      <Flex p={4} justify="flex-end">
        <Button
          variant="ghost"
          onClick={props.onClose}
          isDisabled={loading}
          mr={8}
        >
          Cancel
        </Button>
        <Button
          variantColor="blue"
          onClick={handleSubmit}
          isDisabled={loading}
          isLoading={loading}
        >
          Submit
        </Button>
      </Flex>
    </Box>
  )
}

import React from "react"
import {
  Button,
  Box,
  Image,
  IconButton,
  SimpleGrid,
  Flex,
} from "@chakra-ui/core"
import { useDropzone } from "react-dropzone"
import gql from "graphql-tag.macro"
import {
  useUpdateSettingsMutation,
  MySettingsDocument,
  useGetBulkSignedUrlMutation,
} from "../lib/graphql"
import { formatFileName } from "../lib/helpers"
import { useToast } from "../lib/hooks/useToast"
import { useOpen } from "../lib/hooks/useOpen"

export const GET_BULK_SIGNED_URL = gql`
  mutation GetBulkSignedUrl($data: S3BulkSignedUrlInput!) {
    getBulkSignedS3Url(data: $data) {
      url
      key
    }
  }
`

interface Props {
  onClose?: () => void
}
export const NewAvatar: React.FC<Props> = props => {
  const [images, setImages] = React.useState<File[]>([])
  const [loading, setLoading, setStopLoading] = useOpen()
  const [getBulkSigned] = useGetBulkSignedUrlMutation()
  const [updateSettings] = useUpdateSettingsMutation()
  const toast = useToast()

  const onDrop = React.useCallback(
    (newImages: File[]) => setImages([...images, ...newImages]),
    [images],
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  })

  const handleSubmit = async () => {
    try {
      setLoading()
      if (images.length === 0) return
      const imageKey = `avatars/`
      const imageData = images.map(image => ({
        image,
        fileType: image.type,
        key: imageKey + formatFileName(image.name),
      }))
      // GET SIGNED URLS
      const bulkRes = await getBulkSigned({
        variables: {
          data: {
            files: imageData.map(i => ({ fileType: i.fileType, key: i.key })),
          },
        },
      })

      // UPLOAD TO S3
      if (!bulkRes.data?.getBulkSignedS3Url) return
      await Promise.all(
        bulkRes.data.getBulkSignedS3Url.map(async request => {
          const file = imageData.find(d => d.key === request.key)
          if (!file) return

          await fetch(request.url, {
            method: "PUT",
            headers: {
              "Content-Type": file.fileType,
            },
            body: file.image,
          })
        }),
      )

      await updateSettings({
        refetchQueries: [{ query: MySettingsDocument }],
        variables: {
          data: {
            avatar: imageData[0].key,
          },
        },
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
          Drag or click here to upload images
        </Box>
        {images?.length > 0 && (
          <SimpleGrid spacing={6} columns={3}>
            {images.map((file, i) => (
              <PreviewImage
                key={i}
                src={URL.createObjectURL(file)}
                loading={loading}
                onRemove={() =>
                  setImages(
                    images
                      .slice(0, i)
                      .concat(images.slice(i + 1, images.length)),
                  )
                }
              />
            ))}
          </SimpleGrid>
        )}
      </Box>
      <Flex p={4} justify="flex-end">
        <Button variant="ghost" onClick={props.onClose} isDisabled={loading}>
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

interface PreviewImageProps {
  src: string
  onRemove: () => void
  loading: boolean
}
function PreviewImage(props: PreviewImageProps) {
  return (
    <Box pos="relative" w="100%" h="150px">
      <IconButton
        pos="absolute"
        top={0}
        size="sm"
        isLoading={props.loading}
        isDisabled={props.loading}
        right={0}
        icon="delete"
        variantColor="red"
        aria-label="Remove image"
        onClick={props.onRemove}
      />
      <Image src={props.src} rounded="lg" objectFit="cover" w="100%" h="100%" />
    </Box>
  )
}
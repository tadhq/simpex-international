import { FileInputProps, Pill } from '@mantine/core';

const FileInputValueComponent: FileInputProps['valueComponent'] = ({ value }) => {
  if (value === null) return null;

  if (Array.isArray(value)) {
    return (
      <Pill.Group gap={4}>
        {value.map((file, index) => (
          <Pill key={index}>{file.name}</Pill>
        ))}
      </Pill.Group>
    );
  }

  return <Pill>{value.name}</Pill>;
};

export default FileInputValueComponent;

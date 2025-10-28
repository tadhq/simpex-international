import { RingProgress, Text } from '@mantine/core';

interface RingCountdownProps {
  undoableTimeout: number;
}

export function RingCountdown({ undoableTimeout }: RingCountdownProps) {
  return (
    <RingProgress
      roundCaps
      label={
        <Text
          style={{
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          {undoableTimeout}
        </Text>
      }
      sections={[{ value: undoableTimeout * 20, color: 'primary' }]}
      size={55}
      thickness={4}
    />
  );
}

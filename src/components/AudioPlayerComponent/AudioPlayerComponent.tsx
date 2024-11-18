import s from './AudioPlayerComponent.module.scss';
import 'react-h5-audio-player/src/styles.scss';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import PauseIcon from '@/ui/PauseIcon';
import PlayIcon from '@/ui/PlayIcon';
import UploadIcon from '@/ui/UploadIcon';
import { useMutation } from '@tanstack/react-query';
import { getRecordFetcher } from '@/api/calls';
import { useEffect, useRef, useState } from 'react';
import { streamToBlob } from '@/utils/utils';
import useRecordStore from '@/store/record';

type AudioPlayerComponentProps = {
  duration: string;
  recordId: string;
  partnershipId: string;
  rowId: string;
};

export default function AudioPlayerComponent({ duration, recordId, partnershipId, rowId }: AudioPlayerComponentProps) {
  const [bufferUrl, setBufferUrl] = useState<string>('');
  const { record, setRecord } = useRecordStore();
  const audioPlayerRef = useRef<AudioPlayer>(null);

  const { mutate } = useMutation({ mutationFn: getRecordFetcher });

  useEffect(() => {
    if (rowId !== record) {
      stopAudio();
    };
  }, [record]);

  const stopAudio = () => {
    if (audioPlayerRef.current && audioPlayerRef.current.audio.current) {
      audioPlayerRef.current.audio.current.pause();
      audioPlayerRef.current.audio.current.currentTime = 0;
    }
  };

  const preloadPlayButton = (
    <button
      onClick={() => {
        mutate({
          record: recordId,
          partnership_id: String(partnershipId)
        }, {
          onSuccess: async (res) => {
            if (res.body) {
              try {
                const blob = await streamToBlob(res.body);
                const url = URL.createObjectURL(blob);
                setBufferUrl(url);
                setRecord(rowId);
              } catch (error) {
                console.error('Error converting stream to blob:', error);
              }
            }
          },
          onError: () => {
            console.log('Failed to get data');
          }
        });
      }}
      className={s.preloadButton}
    >
      <PlayIcon />
    </button>
  );

  return (
    <div className={s.root}>
      <AudioPlayer
        ref={audioPlayerRef}
        showSkipControls={false}
        showJumpControls={false}
        src={bufferUrl}
        footer={false}
        defaultCurrentTime={<span>{duration}</span>}
        customProgressBarSection={[
          RHAP_UI.CURRENT_TIME,
          !bufferUrl ? preloadPlayButton : RHAP_UI.MAIN_CONTROLS,
          RHAP_UI.PROGRESS_BAR,
          <button
            className={s.button}
            onClick={() => {
              console.log('Upload');
            }}
          >
            <UploadIcon />
          </button>
        ]}
        customControlsSection={[]}
        customIcons={{
          play: <PlayIcon />,
          pause: <PauseIcon />
        }}
      />
    </div>
  );
}

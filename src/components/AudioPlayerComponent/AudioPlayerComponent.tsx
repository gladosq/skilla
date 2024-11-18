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
import clsx from 'clsx';

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
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

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
      setBufferUrl('');
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

  const handleDownload = () => {
    if (bufferUrl && downloadLinkRef.current) {
      const url = bufferUrl;
      downloadLinkRef.current.href = url;
      downloadLinkRef.current.click();
    }
  };

  return (
    <div className={clsx(s.root, Boolean(bufferUrl) && s.root_playing)}>
      <div id={'player-audio'}>
        <AudioPlayer
          className={s.player}
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
            <>
              <button
                className={clsx(s.button, !bufferUrl && s.button_disabled)}
                onClick={handleDownload}
              >
                <UploadIcon />
              </button>
              <a ref={downloadLinkRef} style={{ display: 'none' }} download="audio.mp3">
                Download
              </a>
            </>
          ]}
          customControlsSection={[]}
          customIcons={{
            play: <PlayIcon />,
            pause: <PauseIcon />
          }}
        />
      </div>
      <div className={s.time} id={'time-audio'}>
        {duration}
      </div>
    </div>
  );
}

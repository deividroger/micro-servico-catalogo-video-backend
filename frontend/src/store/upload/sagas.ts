import { Types } from "./index";
import { actionChannel, call, take } from "@redux-saga/core/effects";
import { AddUploadAction, FileInfo } from "./types";
import { Video } from "../../util/models";
import videoHttp from "../../util/http/video-http";


export function* uploadWatcherSaga() {
    const newFilesChannel = yield actionChannel(Types.ADD_UPLOAD);

    while (true) {
        const { payload }: AddUploadAction = yield take(newFilesChannel);

        for (const fileInfo of payload.files) {
            yield call(uploadFile, { video: payload.video, fileInfo });
        }
    }
}

function* uploadFile({ video, fileInfo }: { video: Video, fileInfo: FileInfo }) {

    const event = yield call(sendUpload, { id: video.id, fileInfo });

}

function* sendUpload({ id, fileInfo }: { id: string, fileInfo: FileInfo }) {

    videoHttp.update(id, {
        [fileInfo.fileField]: fileInfo.file
    }, {
        config: {
            onUploadProgress(progressEvent){
                
            }
        }
    })
}
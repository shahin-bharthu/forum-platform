import { addDocumentToForumIndex } from '../../opensearch-indices/forumIndex.js';
import * as forumRepository from './forumRepository.js';

export const addDocumentsToForumIndex = async () => {
    const allForums = await forumRepository.getForums();

    for (const forum of allForums) {
        const document = {
            name: forum.name,
            purpose: forum.purpose,
            createdBy: forum.createdBy,
        };

        await addDocumentToForumIndex(document);
    }
}

// const document = {
//   name: 'JavaScript Discussion Forum',
//   purpose: 'This is a forum for discussing JavaScript and its various topics',
//   createdBy: 'user123',
// };
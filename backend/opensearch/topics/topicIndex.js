import client from "../../lib/openSearchConnection.js";
import * as topicRepository from "../../features/topics/topicRepository.js";

export async function createTopicIndex() {
    const indexName = 'topic';

    const indexSettings = {
        settings: {
            index: {
                number_of_shards: 1,
                number_of_replicas: 1
            }
        },
        mappings: {
            properties: {
                id: { type: 'keyword' },
                title: { type: 'text' },
                content: { type: 'text' }            
            }
        }
    };

    try {
        const response = await client.indices.create({
            index: indexName,
            body: indexSettings
        });
        console.log('Index created:', response);
    } catch (error) {
        console.error('Error creating index:', error);
    }
}


export async function addDocumentToTopicIndex(document) {
    const indexName = 'topic';

    try {
        const response = await client.index({
            index: indexName,
            body: document
        });
        console.log('Document added:', response);
    } catch (error) {
        console.error('Error adding document:', error);
    }
}


export const addDocumentsToTopicIndex = async () => {
    const allTopics = await topicRepository.getTopics();

    for (const topic of allTopics) {
        const document = {
            id: topic.id,
            title: topic.title,
            content: topic.content,
        };

        await addDocumentToTopicIndex(document);
    }
};


export async function searchTopicIndex(searchText) {
    const indexName = 'topic';

    try {
        const response = await client.search({
            index: indexName,
            body: {
            query: {
                // for exact match
                // multi_match: {
                // query: searchText,
                // fields: ['name', 'purpose']
                // }

                // for partial match, prefix match, name field has higher weight
                multi_match: {
                    query: `*${searchText}*`,
                    fields: ['title^2', 'content'],
                    type: 'phrase_prefix'
                }
            }
            }
        });
        // console.log(`Search results for ${searchText} in ${indexName} index:`, JSON.stringify(response, null, 2));
        return response.body.hits.hits;
    } catch (error) {
        console.error('Error searching index:', error);
    }
}
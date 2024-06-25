import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, RangeControl, FlexItem, Flex, Button, CheckboxControl } from '@wordpress/components';
import { BlockEditProps } from '@wordpress/blocks';
import React, { useEffect, useState } from 'react';
import { IAttributes, ICategory, ITag } from './types';
import apiFetch from '@wordpress/api-fetch';

const Edit: React.FC<BlockEditProps<IAttributes>> = ({ attributes, setAttributes }) => {
    const [categories, setCategories] = React.useState<ICategory[]>([]);
    const [availableTags, setAvailableTags] = React.useState<ITag[]>([]);
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const { itemsPerPage, placeholder } = attributes;

    useEffect(() => {
        // Fetch categories
        apiFetch({ path: '/wp/v2/categories' }).then((categories: any) => {
            setCategories(categories);
        });

        // Fetch tags
        apiFetch({ path: '/wp/v2/tags' }).then((tags: any) => {
            setAvailableTags(tags);
        });
    }, []);

    const onChangePlaceholder = (placeholder: string) => {
        setAttributes({ placeholder });
    };
    const onChangeItemsPerPage = (value: string) => {
        setAttributes({ itemsPerPage: parseInt(value, 10) });
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Settings', 'advanced-search-block')}>
                    <TextControl
                        value={placeholder}
                        label={__('Placeholder', 'advanced-search-block')}
                        placeholder={placeholder}
                        onChange={onChangePlaceholder}
                    />
                    <RangeControl
                        label={__('Items per page', 'advanced-search-block')}
                        value={itemsPerPage}
                        onChange={onChangeItemsPerPage}
                        min={1}
                        max={50}
                    />
                </PanelBody>
            </InspectorControls>
            <div {...useBlockProps()}>
                <Flex align="flex-end">
                    <FlexItem>
                        <TextControl
                            label="Keyword"
                            onChange={onChangePlaceholder}
                            value={placeholder}
                        />
                    </FlexItem>
                    <FlexItem>
                        <SelectControl
                            label="Category" >
                            <option value="">Select a category</option>
                            {categories.map((category: ICategory) =>
                                (<option value={category.id}>{category.name}</option>)
                            )}
                        </SelectControl>
                    </FlexItem>
                    <FlexItem>
                        <Button className="submit-btn" variant="primary" text="Search" />
                    </FlexItem>
                </Flex>
                <div>
                    <span className="inline-block">Tags:</span>
                    {availableTags.map((tag: ITag) => (
                        <CheckboxControl
                            className="inline-block"
                            key={tag.id}
                            label={tag.name}
                            checked={selectedTags.includes(tag.id)}
                            onChange={(isChecked) => {
                                if (isChecked) {
                                    setSelectedTags([...selectedTags, tag.id]);
                                } else {
                                    setSelectedTags(selectedTags.filter((id: number) => id !== tag.id));
                                }
                            }}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Edit;



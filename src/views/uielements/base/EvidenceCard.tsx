// EvidenceCard.tsx
import React from 'react';

type EvidenceCardProps = {
    title?: string;
    imageUrls?: string[];
    remark?: string;
};

export default function EvidenceCard({
    title = 'Evidence',
    imageUrls = [],
    remark = '',
}: EvidenceCardProps) {
    return (
        <div style={styles.container}>
            <div style={styles.title}>{title}</div>
            {imageUrls?.length ? (
                <div style={styles.imageRow}>
                    {imageUrls.map((uri, i) => (
                        <img key={i} src={uri} alt="" style={styles.thumb} />
                    ))}
                </div>
            ) : (
                <div style={styles.subtext}>No images</div>
            )}
            <div style={styles.subtext}>
                {remark?.trim() ? remark : 'No remarks provided.'}
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: { marginTop: 6 },
    title: { fontWeight: '600', marginBottom: 4 },
    imageRow: { display: 'flex', flexDirection: 'row', margin: '4px 0' },
    thumb: {
        width: 72,
        height: 54,
        borderRadius: 6,
        marginRight: 6,
        backgroundColor: '#f0f0f0',
        objectFit: 'cover',
    },
    subtext: { color: '#666', fontSize: 13 },
};

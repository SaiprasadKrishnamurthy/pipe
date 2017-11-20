package org.pipes.amqp;

import org.pipes.transformer.TransformerDelegate;
import org.springframework.stereotype.Component;

import javax.inject.Inject;

@Component
public class MessageListener {
    private final TransformerDelegate transformerDelegate;

    @Inject
    public MessageListener(final TransformerDelegate transformerDelegate) {
        this.transformerDelegate = transformerDelegate;
    }

    public void receiveMessage(final byte[] message) throws Exception {
        transformerDelegate.transform(message);
    }
}